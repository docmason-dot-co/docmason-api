# Development Guide for doc-mason-api

## Project Structure

```
doc-mason-api/
├── src/
│   ├── interfaces/           # TypeScript interfaces
│   │   ├── TemplateInterfaces.ts
│   │   ├── TemplateDataInterfaces.ts
│   │   ├── TemplateRequestInterfaces.ts
│   │   ├── UserApiInterfaces.ts
│   │   └── UserInterfaces.ts
│   ├── modules/              # API endpoint modules
│   │   ├── TemplateApi.ts
│   │   ├── TemplateDataApi.ts
│   │   ├── TemplateRequestApi.ts
│   │   ├── UserApiApi.ts
│   │   └── UserApi.ts
│   ├── BaseApi.ts            # Base API client with common functionality
│   ├── DocMasonApi.ts        # Main API class that combines all modules
│   ├── fetch.ts              # Cross-platform fetch adapter
│   ├── types.ts              # Common types and interfaces
│   └── index.ts              # Main entry point
├── examples/                 # Usage examples
├── dist/                     # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Watch for changes and rebuild
npm run dev

# Clean build output
npm run clean

# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

## Building and Publishing

1. **Build the package:**
   ```bash
   npm run build
   ```

2. **Test the package locally:**
   ```bash
   node test-package.js
   ```

3. **Update version in package.json**

4. **Publish to npm:**
   ```bash
   npm publish
   ```

## Adding New API Endpoints

To add a new API endpoint:

1. **Create interfaces** in `src/interfaces/`
2. **Create API module** in `src/modules/`
3. **Update main API class** in `src/DocMasonApi.ts`
4. **Update exports** in `src/index.ts`
5. **Add to README.md** documentation

### Example: Adding a new "Report" API

1. Create `src/interfaces/ReportInterfaces.ts`:
```typescript
export interface ReportDto {
  Report_guid: string;
  Report_Name: string;
  // ... other fields
}

export interface CreateReportDto {
  Report_Name: string;
  // ... other fields
}

// ... other interfaces
```

2. Create `src/modules/ReportApi.ts`:
```typescript
import { BaseApi } from '../BaseApi';
import { ReportDto, CreateReportDto } from '../interfaces/ReportInterfaces';

export class ReportApi extends BaseApi {
  async create(params: CreateReportDto): Promise<ReportDto> {
    return this.makeRequest<ReportDto>('/report', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ... other methods
}
```

3. Update `src/DocMasonApi.ts`:
```typescript
import { ReportApi } from './modules/ReportApi';

export class DocMasonApi {
  public readonly report: ReportApi;
  // ... other modules

  constructor(config: DocMasonApiConfig) {
    // ...
    this.report = new ReportApi(config);
  }

  updateConfig(newConfig: Partial<DocMasonApiConfig>): void {
    // ...
    (this.report as any).config = this.config;
  }
}

// Add to exports
export * from './interfaces/ReportInterfaces';
```

4. Update `src/index.ts`:
```typescript
export * from './interfaces/ReportInterfaces';
```

## Cross-Platform Considerations

The package is designed to work in both Node.js and browser environments:

- **Fetch**: Uses `globalThis.fetch` when available, falls back to `node-fetch` peer dependency
- **Types**: Includes DOM types for browser compatibility
- **Binary Data**: Returns `ArrayBuffer` for PDFs, with helper methods for `Buffer`/`Uint8Array`

## Error Handling

All API methods throw structured `ApiError` objects:

```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Array<{
    msg: string;
    param?: string;
    location?: string;
  }>;
}
```

## Testing

Currently uses a simple test script (`test-package.js`). Consider adding:

- Unit tests with Jest
- Integration tests
- Type checking tests
- Browser compatibility tests

## Performance Considerations

- Uses peer dependencies to avoid bundling fetch polyfills unnecessarily
- Lazy loads node-fetch only when needed
- Minimal dependencies to keep bundle size small
- TypeScript provides tree-shaking opportunities