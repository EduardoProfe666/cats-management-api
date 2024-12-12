# Cat Management API 🐾

<div align="center">

![Cat](/assets/banner.png)

[![Made with NestJS][nestjs-badge]][nestjs-url]
[![TypeScript][ts-badge]][ts-url]
[![License][license-badge]][license-url]
[![PRs Welcome][prs-badge]][prs-url]

_An example API to manage your cats, built with NestJS and TypeScript_

[🚀 Getting Started](#-getting-started) | [🛠️ Tech Stack](#-tech-stack) | [📄 API Endpoints](#-api-endpoints)

</div>

## ✨ Features

- **User Authentication**: Secure login and registration with JWT.
- **Cat Management**: Create, read, update, and delete cat records.
- **Breed Management**: Manage different breeds of cats.
- **Pagination & Filtering**: Efficiently retrieve data with pagination and search capabilities.
- **Role-Based Access**: Control access based on user roles.

## 🛠️ Tech Stack

### Backend

- ⚡ [NestJS](https://nestjs.com/) for building efficient and scalable server-side applications
- 📝 [TypeScript](https://www.typescriptlang.org/) for type-safe coding
- 🌱 [PostgreSQL](https://www.postgresql.org/) as the database
- 🔒 [JWT](https://jwt.io/) for secure authentication
- 📦 [TypeORM](https://typeorm.io/) for database interaction

## 🚀 Getting Started

### Prerequisites

- Node.js version **16.0 or higher**
- NPM/PNPM/YARN
- PostgreSQL installed and running

### Installation

```bash
# Clone the repository
git clone https://github.com/EduardoProfe666/cats-management-api

# Navigate to project directory
cd cats-management-api

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env # Update .env with your settings

# Start the application
pnpm run start:dev
```

### Production Build

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

## 📄 API Endpoints

Here are the available API endpoints for managing cats and users:

| Method      | Endpoint                     | Description                                          |
|-------------|------------------------------|------------------------------------------------------|
| POST        | `/v1/auth/login`             | Authenticate into the system                         |
| POST        | `/v1/auth/register`          | Register a new user                                  |
| POST        | `/v1/auth/change-password`   | Change current user password                         |
| POST        | `/v1/auth/refresh`           | Refresh tokens                                       |
| GET         | `/v1/cats`                   | Get all cats                                        |
| POST        | `/v1/cats`                   | Create a new cat                                    |
| GET         | `/v1/cats/me`                | Get the current user's cats                          |
| GET         | `/v1/cats/{id}`              | Get a cat by its ID                                 |
| PUT         | `/v1/cats/{id}`              | Update a cat of the current user                    |
| DELETE      | `/v1/cats/{id}`              | Delete a cat of the current user                    |
| GET         | `/v1/breeds`                 | Get all breeds                                      |
| POST        | `/v1/breeds`                 | Create a new breed                                   |
| GET         | `/v1/breeds/{id}`            | Get a breed by its ID                                |
| PATCH       | `/v1/breeds/{id}`            | Update a breed by its ID                             |
| DELETE      | `/v1/breeds/{id}`            | Delete a breed by its ID                             |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
<strong>Created with ❤️ by EduardoProfe666 <a href="https://eduardoprofe666.github.io">🎩</a></strong>
</div>



<!-- MARKDOWN LINKS & BADGES -->

[nestjs-badge]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[nestjs-url]: https://nestjs.com/
[ts-badge]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org/
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge
[license-url]: https://opensource.org/licenses/MIT
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge
[prs-url]: http://makeapullrequest.com