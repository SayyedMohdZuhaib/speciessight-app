# **App Name**: WildChat

## Core Features:

- Image Upload UI: Implement a user input area for image uploads. Accept JPG, PNG, and JPEG formats. Display a thumbnail preview of the uploaded image as a 'user message'.
- Species Classification: Utilize an image classification model (via Langchain tool) to predict the wildlife species in the uploaded image and return the top prediction with a confidence score.
- Species Description: Employ a language model (via Langchain tool) to generate a natural language description of the classified species, including common/scientific name, habitat, diet, behavior, and conservation status.
- Chat Interface: Mimic ChatGPT's chat interface with a vertical chat flow, alternating user and system messages. Maintain a clean, minimal design focused on readability and responsiveness. Each interaction appears as one turn in the conversation.
- Temporary Sessions: Ensure each session is temporary and resets on refresh, with no persistent chat history or storage.

## Style Guidelines:

- Primary color: White or light grey for a clean background.
- Secondary color: Dark grey for text, input fields, and message bubbles.
- Accent: Teal (#008080) to highlight interactive elements and AI responses.
- Vertical chat layout with distinct user and system message styling.
- Use a responsive design to ensure the app works well on different screen sizes.
- Simple, recognizable icons for image upload and other actions.
- Subtle animations for loading states and message transitions.

## Original User Request:
Build a web application that mimics the basic UI and interaction style of ChatGPT, designed for classifying wildlife species from uploaded images. The app should provide a conversational and intuitive interface that walks users through image upload, classification, and species explanation using AI tools.

🔍 1. Image Upload (User Input Panel)
Implement a user input area similar to ChatGPT's text input, allowing image uploads instead of text.

Accept standard image file types (JPG, PNG, JPEG).

Display a thumbnail preview of the uploaded image in the chat interface as a "user message."

🧠 2. Species Classification (AI Model via Langchain Tool)
Pass the uploaded image to a pre-trained image classification model (e.g., ResNet or a wildlife-specific classifier).

Integrate this step via Langchain to structure and modularize the model invocation.

Return the top predicted wildlife species along with a confidence score.

📖 3. Species Description (Language Model)
Use a language model (e.g., GPT via Langchain) to generate a natural language description of the classified species.

The response should include key information like:

Common/scientific name

Habitat

Diet

Behavior

Conservation status

Show the AI response as a "system message" in the chat, styled similarly to a ChatGPT response.

💬 4. ChatGPT-Style Frontend (Interactive UI)
Mimic ChatGPT's chat interface:

Vertical chat flow with alternating user and system messages

Clean, minimal design with focus on readability and responsiveness

Each interaction (image upload and AI response) appears as one turn in the conversation.

No persistent chat history or storage — each session is temporary and resets on refresh.
  