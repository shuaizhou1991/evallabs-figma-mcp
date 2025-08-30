# Eval Labs - Product Management App

A modern product management application built with Next.js, featuring Figma MCP integration and enhanced user experience with toast notifications.

## 🚀 Features

- **Product Management**: Create, view, and delete products
- **Advanced Filtering**: Filter products by intelligence, speed, price range, input/output types, and license
- **Search Functionality**: Real-time search across all products
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Toast Notifications**: Beautiful success and error notifications using shadcn/ui
- **Authentication Ready**: Built with NextAuth.js for user authentication
- **Figma Integration**: MCP (Model Context Protocol) integration with Figma

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **State Management**: React Context
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shuaizhou1991/evallabs-figma-mcp.git
   cd evallabs-figma-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

### Product Management
- Create new products with custom names, licenses, and visibility settings
- View detailed product information including benchmarks and performance metrics
- Delete products with confirmation dialog
- Real-time toast notifications for all operations

### Advanced Filtering
- Filter by intelligence level (High, Medium, Low)
- Filter by speed (Fast, Medium, Slow)
- Price range slider
- Input/Output type filters
- License type filters
- Search functionality

### User Experience
- Responsive design that works on all devices
- Smooth animations and transitions
- Intuitive navigation
- Clear visual feedback for all actions

## 🎨 UI Components

The app uses shadcn/ui components for a consistent and modern design:
- Toast notifications with success/error variants
- Radio groups for selection
- Sliders for range inputs
- Responsive cards and layouts

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and data
└── types/              # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ by [shuaizhou1991](https://github.com/shuaizhou1991)**
