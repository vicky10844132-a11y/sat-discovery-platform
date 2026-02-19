# Backend Services - SAT-DISCOVERY V3.0

This directory contains the backend microservices for the enterprise-grade SAT-DISCOVERY platform.

## Architecture

Five-domain microservices architecture:

```
backend/
├── services/
│   ├── gateway/          # API Gateway (Access Domain)
│   ├── data-ingestion/   # Data Ingestion Domain
│   ├── orbital/          # Orbital Domain
│   ├── processing/       # Processing Domain
│   └── scheduler/        # Orchestration Domain
│
├── shared/               # Shared libraries
│   ├── database/         # Database utilities
│   ├── auth/             # Authentication
│   └── utils/            # Common utilities
│
└── plugins/              # Plugin system
    ├── connectors/       # Data source connectors
    └── algorithms/       # Processing algorithms
```

## Status

🚧 **Under Development** - V3.0

See [ARCHITECTURE_V3_FULLSTACK.md](../ARCHITECTURE_V3_FULLSTACK.md) for complete architecture.

---

**Last Updated**: 2026-02-19  
**Version**: 3.0.0-alpha
