
# Passwords list Generator (on going )

A tool for ethical hackers, pentesters, and researching students to generate potential username and password lists.

Made by [Madan Raj](https://www.linkedin.com/in/madanraj0)

## Overview

Passwords Generator is a React-based web application designed to assist cybersecurity professionals and students in generating lists of potential credentials for various pentesting and research activities. It offers three distinct modes of password generation:

1.  **Generate from Samples:** Analyze user-provided sample passwords and create numerous plausible variations using common mutation techniques.
2.  **Generate from Target Info:** Based on information about the target device (manufacturer, model, common usernames), the tool uses AI to suggest potential default credentials and common password patterns.
3.  **Generate by Length:** Create lists of passwords with a specified length, with the option to include mixed characters and numbers, only characters, or only numbers.

**Important Ethical & Legal Notice:**

This tool is intended for **educational and ethical cybersecurity research purposes only**. **DO NOT use this tool for any unauthorized access or illegal activities.** Always ensure you have **explicit permission** from the owner of any device you intend to test. The AI's knowledge is based on its training data and does not perform live internet searches or access real-time breach databases. Misuse of this tool can lead to severe legal consequences.

## Features

* **Generate from Sample Passwords:** Input a set of example passwords, and the AI will generate a larger list of potential variations.
* **Generate from Target Information:** Provide details about the target IoT device, and the AI will suggest common default credentials and patterns.
* **Generate by Length:** Specify the desired password length and character type (mixed, characters only, numbers only) to create custom password lists.
* **User-Friendly Interface:** A clean and intuitive web interface built with React.

## Getting Started

This is a client-side React application and can be run directly in any modern web browser.

1.  **Clone the Repository (if you haven't already):**
    ```bash
    git clone https://github.com/your-username/passwords-generator-react.git
    cd passwords-generator-react
    ```
    (Replace `your-username/passwords-generator-react` with your actual repository URL)

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm start
    ```
    This will usually open the application in your default web browser at `http://localhost:3000`.

4.  **Build for Production (Optional):**
    ```bash
    npm run build
    ```
    This command builds a production-ready version of the application in the `build` folder. You can then deploy these static files to a web server.

## Usage

1.  Open the application in your web browser.
2.  You will see three tabs: "Generate from Samples", "Generate from Target Info", and "Generate by Length".
3.  **Generate from Samples:** Enter your sample passwords (one per line) in the provided text area and click "Generate Password List".
4.  **Generate from Target Info:** Enter the device manufacturer, model (optional), and any additional common usernames (comma-separated, optional). Click "Generate Credentials from Target Info".
5.  **Generate by Length:** Enter the desired password length (between 6 and 30 characters) and the number of passwords to generate (between 1 and 200). Select the desired character type (Mixed, Only Characters, Only Numbers) and click "Generate Passwords by Length".
6.  The generated password lists will be displayed in a scrollable text area below the respective generation options.

## Contributing

Contributions to this project are welcome! If you have ideas for new features, improvements, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch for your changes (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a pull request.

## License

This project is open-source and available under the [Specify your license here, e.g., MIT License](LICENSE).

## Acknowledgements

* Built using the React JavaScript library.
* Leverages the power of the Gemini AI model for intelligent password generation.
* Inspired by the needs of the cybersecurity community for ethical pentesting tools.

## Contact

[Madan Raj](https://www.linkedin.com/in/madanraj0)
