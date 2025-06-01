# Cosmic.ts: A Structured Multi-Repo Framework for Next.js

<p align="left">
  <img src="logo.png" alt="Cosmic.ts Logo" width="200"/>
</p>

Cosmic.ts is a TypeScript-based Next.js mono-repo framework, engineered for a structured approach to managing multiple projects within a clustered environment. It's designed to streamline development,
enhance code reuse, and simplify the management of complex web applications.

---

## ⚙️ Example Configuration

Below is an example configuration file that demonstrates how to set up your projects and clusters within Cosmic.ts. This file can be used as a starting point for your own `cosmic.yaml` configuration.

```yaml
HOST_PORT: 8000
BASE:
    - NAME: main
      PORT: 3000
      COMMAND: /bin/sh -ec "yarn build && yarn start"
      ENVIRONMENT_VARIABLES:
          DATABASE_URL: "__main__.db"
          NEXT_PUBLIC_BASE_PORT: 3000
          AUTH_TRUST_HOST: "true"
          AUTH_URL: "http://localhost:8000"
          AUTH_SECRET: "--------------------------------------"
          AUTH_GOOGLE_ID: "--------------------------------------"
          AUTH_GOOGLE_SECRET: "--------------------------------------"
          GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:3000/api/auth/callback/google"
          CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
CLUSTERS:
    - NAME: cluster-1
      PROJECTS:
          - NAME: project-1
            PORT: 4001
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-1/project-1"
                DATABASE_URL: "cluster-1-project-1.db"
                NEXT_PUBLIC_BASE_PORT: 4001
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-1/project-1"
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:4001/cluster-1/project-1/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
          - NAME: project-2
            PORT: 4002
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-1/project-2"
                DATABASE_URL: "cluster-1-project-2.db"
                NEXT_PUBLIC_BASE_PORT: 4002
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-1/project-2"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:4002/cluster-1/project-2/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
    - NAME: cluster-2
      PROJECTS:
          - NAME: project-1
            PORT: 5001
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-2/project-1"
                DATABASE_URL: "cluster-2-project-1.db"
                NEXT_PUBLIC_BASE_PORT: 5001
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-2/project-1"
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:5001/cluster-2/project-1/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
          - NAME: project-2
            PORT: 5002
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-2/project-2"
                DATABASE_URL: "cluster-2-project-2.db"
                NEXT_PUBLIC_BASE_PORT: 5002
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-2/project-2"
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:5002/cluster-2/project-2/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
```

---

## 📖 Documentation

The comprehensive documentation for Cosmic.ts is **coming soon!**

We're diligently working to provide detailed guides, API references, and examples to help you get the most out of this framework. Stay tuned for updates!

---
