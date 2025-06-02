import { execSync } from "child_process";
import { config } from "dotenv";
import OpenAI from "openai";
config({ path: ".env" });
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in your environment variables.");
    process.exit(1);
} else console.log("OpenRouter API Key loaded successfully.");
const openrouter = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: OPENROUTER_API_KEY });
async function generateCommitMessage(diff) {
    try {
        const response = await openrouter.chat.completions.create({
            model: "nousresearch/deephermes-3-mistral-24b-preview:free",
            messages: [
                {
                    role: "system",
                    content: `Generate a concise Git commit message based on the following code changes (diff) for a single file. Follow the Conventional Commits specification (type(scope): description). Identify the affected package or area within the monorepo for the scope. The type should be one of feat, fix, docs, chore, style, refactor, test, build, ci, perf, or revert. The description should be a short, clear summary of the changes.`,
                },
                { role: "user", content: `Diff: ${diff}\n\nCommit message:` },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });
        const text = response.choices[0].message?.content;
        return text ? text.trim() : null;
    } catch (error) {
        console.error("Error generating commit message from AI:", error.message);
        return null;
    }
}
function getStagedFiles() {
    try {
        const files = execSync("git diff --name-only --cached").toString().trim().split("\n");
        return files.filter(file => file.length > 0);
    } catch (error) {
        console.error("Error getting staged files:", error.message);
        return [];
    }
}
function getFileDiff(filePath) {
    try {
        return execSync(`git diff --cached "${filePath}"`).toString();
    } catch (error) {
        console.error(`Error getting diff for ${filePath}:`, error.message);
        return null;
    }
}
function gitCommit(message, filePath) {
    try {
        console.log(`Committing ${filePath} with message:\n${message}`);
        execSync(`git commit -m "${message}" -- "${filePath}"`);
        console.log(`Commit successful for ${filePath}.`);
    } catch (error) {
        console.error(`Error during git commit for ${filePath}:`, error.message);
    }
}
function gitPush() {
    try {
        console.log("Pushing changes...");
        execSync("git push");
        console.log("Push successful.");
    } catch (error) {
        console.error("Error during git push:", error.message);
    }
}
async function main() {
    const stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
        console.log("No staged changes to commit.");
        process.exit(0);
    }
    for (const filePath of stagedFiles) {
        console.log(`Processing file: ${filePath}`);
        const fileDiff = getFileDiff(filePath);
        if (!fileDiff) {
            console.warn(`Skipping ${filePath} due to inability to get diff.`);
            continue;
        }
        const commitMessage = await generateCommitMessage(fileDiff);
        if (commitMessage) gitCommit(commitMessage, filePath);
        else console.error(`Failed to generate commit message for ${filePath}. Skipping commit for this file.`);
    }
    if (stagedFiles.length > 0) gitPush();
}
main();
