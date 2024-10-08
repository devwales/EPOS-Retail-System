# EPOS System

## Overview

This EPOS (Electronic Point of Sale) system is a web-based application designed for small to medium-sized retail businesses. It provides a user-friendly interface for managing sales, inventory, and basic reporting. The system is built using React and TypeScript, offering a modern and responsive user experience.

## Features

### Cashier Interface
- Product catalog with search and category filtering
- Shopping basket functionality
- Support for product variations
- Quantity adjustment in the basket
- Multiple payment methods (Cash, Card)
- Receipt generation

### Admin Interface
- Product management (Add, Edit, Delete)
- Category management
- Sales history and basic reporting
- Refund functionality
- Payment method management
- System settings (Site name, Currency)

## Technology Stack

- React
- TypeScript
- Tailwind CSS for styling
- Vite as the build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd epos-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Usage

### Cashier Mode
- The default view is the Cashier Interface.
- Browse products, add them to the basket, and process sales.
- Use the search bar to find products quickly.
- Adjust quantities in the basket as needed.
- Complete transactions using available payment methods.

### Admin Mode
- Click "Switch to Admin" to access the Admin Interface.
- Manage products: Add new products, edit existing ones, or remove products.
- Organize products into categories.
- View sales history and process refunds if necessary.
- Adjust system settings like site name and currency.

## Customization

- **Site Name**: Can be changed in the Admin Interface under Settings.
- **Currency**: Supports USD ($), GBP (£), and EUR (€). Can be changed in Settings.
- **Products and Categories**: Fully customizable through the Admin Interface.

## Development

- The project uses Vite for fast development and building.
- Tailwind CSS is used for styling. Customize the design by editing Tailwind classes.
- TypeScript ensures type safety throughout the application.

### Building for Production

To create a production build:

```
npm run build
```

This will generate optimized files in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).