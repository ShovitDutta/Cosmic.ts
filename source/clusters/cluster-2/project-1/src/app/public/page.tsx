"use client";
import { useEffect, useState } from "react";
export default function PublicPage() {
    const [allPeerInfo, setAllPeerInfo] = useState<{ basePort: string; basePath: string }[]>([]);
    useEffect(() => {
        async function ConnectedPeer() {
            const peerUrls = [
                "http://localhost:3000/api/peer",
                "http://localhost:4001/cluster-1/project-1/api/peer",
                "http://localhost:4002/cluster-1/project-2/api/peer",
                "http://localhost:5001/cluster-2/project-1/api/peer",
                "http://localhost:5002/cluster-2/project-2/api/peer",
            ];
            const responses = await Promise.all(peerUrls.map(url => fetch(url)));
            for (const response of responses) if (!response.ok) throw new Error(`HTTP error! status: ${response.status} from ${response.url}`);
            const data = await Promise.all(responses.map(response => response.json()));
            setAllPeerInfo(data);
        }
        ConnectedPeer();
    }, []);
    if (allPeerInfo.length === 0) return <div>Loading all peer info...</div>;
    return (
        <div>
            <h1>All Connected Peer Info</h1>
            {allPeerInfo.map((info, index) => (
                <div key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
                    <h2>Peer {index + 1}</h2> <p>Base Port: {info.basePort}</p> <p>Base Path: {info.basePath}</p>
                </div>
            ))}
        </div>
    );
}