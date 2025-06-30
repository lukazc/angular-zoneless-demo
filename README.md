# Angular Zoneless Change Detection Demo

A modern Angular 20 dashboard application showcasing zoneless change detection, signals, and best practices. Features include interactive widgets, Pokemon data management, and comprehensive error handling.
  
  
  
## 🚀 Live Demo

[View Live Application](https://lukazc.github.io/angular-zoneless-demo/)

## ⚡ Features

- **Zoneless Architecture**: Built with Angular 20's experimental zoneless change detection
- **Signal-Based State Management**: Reactive state management using Angular signals
- **Interactive Dashboard**: Multiple widgets including maps, charts, and data tables
- **Pokemon Data Browser**: Paginated table with detail views using GraphQL
- **Material Design**: Modern UI with Angular Material components
- **Responsive Design**: Mobile-first responsive layout
- **Error Handling**: Global error interceptor with user-friendly notifications
- **Loading States**: Global progress indicators and loading spinners
- **Type Safety**: Full TypeScript implementation with strict mode



## 📋 Prerequisites

**Node.js Version Requirement**: `^20.19.0 || ^22.12.0 || ^24.0.0`

Verify your Node.js version:
```bash
node --version
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm).



## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lukazc/angular-zoneless-demo.git
   cd angular-zoneless-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🧪 Testing



### Unit Tests
Run the test suite with coverage:
```bash
npm test

# Run tests with coverage
ng test --code-coverage

# Run tests in CI mode (single run)
ng test --watch=false --browsers=ChromeHeadless
```

### Test Results
- All components have focused unit tests
- Services and stores are fully tested
- Interceptors have comprehensive test coverage
- Current test coverage: 90%+



## 🏗️ Building

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

Build artifacts will be stored in the `dist/` directory.



## 📚 Documentation Generation


### Generate Documentation
```bash
# Generate TypeDoc documentation
npm run docs

# Serve documentation locally
npm run docs:serve
```

### View Documentation
Documentation will be generated in the `public/docs` directory and can be:
1. **Served locally**: `npm run docs:serve`
2. **Deployed with the app**: Documentation is automatically included in production builds
3. **Accessed via route**: Available at `/docs` in the running application



## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, interceptors, stores
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── models/           # TypeScript interfaces
│   │   ├── services/         # Singleton services
│   │   └── stores/           # Signal-based stores
│   ├── features/            # Feature modules
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── pokemon/         # Pokemon data features
│   └── shared/              # Shared components
├── styles.scss              # Global styles
└── index.html
```

## 🔧 Technologies Used

- **Angular 20** - Framework with experimental zoneless support
- **TypeScript** - Type-safe development
- **Angular Material** - UI component library
- **Chart.js** - Data visualization
- **Leaflet** - Interactive maps
- **RxJS** - Reactive programming
- **Jasmine/Karma** - Testing framework

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues, please [open an issue](https://github.com/lukazc/angular-zoneless-demo/issues).

---
