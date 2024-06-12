
# Chat APP

This project introduces a chat functionality that supports multiple mediums. The app facilitates chat via WhatsApp using the WhatsApp Cloud API and enables bidirectional communication through Centrifugo. It also features AI-assisted messaging.

## Components

1. **Backend**: The backend component comprises APIs responsible for managing chat-related functionalities.

2. **chatbot-context**: For generating AI responses using a trained model, with the ability to upload a data source.

3. **Authentication Shield**: Ensures secure access to the chat app system by implementing robust authentication mechanisms to protect sensitive user data and system functionalities.

## Prerequisites

Before getting started, ensure the following prerequisites are met:

- Docker installed on your machine

## Getting Started

1. **Clone Repository**: Begin by cloning the repository to your local machine.
   
2. **Install centrifugo**: Execute the following command in your project root directory.

 ```bash
   curl -sSLf https://centrifugal.dev/install.sh | sh
 ```

3. **Generate config files** : Execute the following command in your project root directory. Afterward, customize the configuration according to your preferences.

```bash
   ./centrifugo genconfig
```

4. **Replace Meta credentials** : Replace the placeholder credentials with your actual Meta credentials in the project table within the provided seed file located in the ``backend`` -> ``shared``-> ``prisma`` -> ``seeder`` folder.

```bash
import { PrismaClient } from '@prisma/client'

async function addProject(prisma: PrismaClient): Promise<void> {
  await prisma.projects.create({
    data: {
      id: "1",
      name: 'Sample project',
      webhook_url: 'YOUR_WEBHOOK_URL',
      channel_name: 'YOUR_CENTRIFUGO_CHANNEL_NAME',
      whatsapp_business_id: 'YOUR_BUSINESS_ID',
      whatsapp_phone_number_id: 'YOUR_PHONE_NUMBER_ID',
      whatsapp_business_token: 'YOUR_BUSINESS_TOKEN',
      webhook_verify_token: 'YOUR_WEHOOK_VERIFY_TOKEN',
    },
  })
}

export default addProject

```

5. **Add ENV** : Add  env files in the backend and shield folders. You can find sample in ``sample.env.function`` and ``sample.env``, which indicate where they are required.

6. **Build Docker Compose**: Execute the following commands in your terminal:
    ```bash
    docker compose build
    ```

7. **Start the Project**: Once the build process is complete, start the project with:
    ```bash
    docker compose up
    ```
## License

This project is licensed under the [MIT License](LICENSE).