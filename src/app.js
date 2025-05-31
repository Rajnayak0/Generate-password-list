import React, { useState } from 'react';

// Main App component for the Passwords Generator Tool
const App = () => {
    // State to manage the selected tab (Sample Passwords, Target Info, or Generate by Length)
    const [activeTab, setActiveTab] = useState('samples');

    // State for Sample Passwords input
    const [samplePasswords, setSamplePasswords] = useState('');
    // State for generated passwords from samples
    const [generatedSamplePasswords, setGeneratedSamplePasswords] = useState('');
    // Loading state for sample password generation
    const [loadingSamples, setLoadingSamples] = useState(false);

    // States for Target Information inputs
    const [deviceManufacturer, setDeviceManufacturer] = useState('');
    const [deviceModel, setDeviceModel] = useState('');
    const [commonUsernames, setCommonUsernames] = useState('');
    // State for generated credentials from target info
    const [generatedTargetCredentials, setGeneratedTargetCredentials] = useState('');
    // Loading state for target info generation
    const [loadingTarget, setLoadingTarget] = useState(false);

    // States for Generate by Length inputs
    const [passwordLength, setPasswordLength] = useState('');
    const [numPasswordsToGenerate, setNumPasswordsToGenerate] = useState(10); // Default to 10 passwords
    const [characterType, setCharacterType] = useState('mixed'); // 'mixed', 'characters', 'numbers'
    // State for generated passwords by length
    const [generatedLengthPasswords, setGeneratedLengthPasswords] = useState('');
    // Loading state for generate by length
    const [loadingLength, setLoadingLength] = useState(false);

    // State for general error messages
    const [errorMessage, setErrorMessage] = useState('');

    // Function to call the Gemini API
    const callGeminiAPI = async (prompt, generationConfig = {}) => {
        setErrorMessage(''); // Clear previous errors
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory, generationConfig };
            const apiKey = ""; // Canvas will automatically provide the API key at runtime

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Unexpected API response structure or no content generated.");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setErrorMessage(`Failed to generate: ${error.message}`);
            return null;
        }
    };

    // Handler for generating passwords from samples
    const handleGenerateSamples = async () => {
        if (!samplePasswords.trim()) {
            setErrorMessage("Please provide some sample passwords.");
            return;
        }

        setLoadingSamples(true);
        setGeneratedSamplePasswords(''); // Clear previous results

        const prompt = `Analyze the following sample passwords and generate a list of 50 new, plausible password variations. Apply common password mutation techniques such as:
- Character substitutions (e.g., 'a' to '@', 's' to '$', 'i' to '1', 'o' to '0')
- Adding numbers or special characters to the beginning or end
- Case changes (e.g., capitalizing the first letter, alternating case)
- Common prefixes or suffixes (e.g., year numbers like 2023, 2024, 2025, common words like 'admin', 'user')
- Simple permutations or combinations of sample elements.
Ensure the generated passwords are distinct from the samples and from each other. Provide the list as a newline-separated list.

Samples:
${samplePasswords.trim()}`;

        const result = await callGeminiAPI(prompt);
        if (result) {
            setGeneratedSamplePasswords(result);
        }
        setLoadingSamples(false);
    };

    // Handler for generating credentials from target information
    const handleGenerateTargetInfo = async () => {
        if (!deviceManufacturer.trim() && !deviceModel.trim() && !commonUsernames.trim()) {
            setErrorMessage("Please provide at least one piece of target information (Manufacturer, Model, or Common Usernames).");
            return;
        }

        setLoadingTarget(true);
        setGeneratedTargetCredentials(''); // Clear previous results

        const prompt = `Based on the following target details, act as a cybersecurity researcher specializing in IoT device security. Generate a comprehensive list of potential default usernames and passwords, and common password patterns or examples typically associated with such devices, or found in publicly known breaches for similar systems.
Focus on patterns and widely known defaults rather than specific live data.
Include common usernames like 'admin', 'user', 'root', 'guest', 'support', 'test'.
Consider common password patterns like 'password', '123456', 'admin123', 'default', 'guest', 'network', 'router', 'iotdevice', 'manufacturername'.
If a manufacturer or model is provided, try to infer common defaults or known vulnerabilities related to that specific entity based on your training data.
Provide the list as a newline-separated list of "username:password" pairs or just passwords if no specific username is implied.

Target Details:
Manufacturer: ${deviceManufacturer.trim() || 'N/A'}
Model: ${deviceModel.trim() || 'N/A'}
Common Usernames to consider: ${commonUsernames.trim() || 'N/A'}`;

        const result = await callGeminiAPI(prompt);
        if (result) {
            setGeneratedTargetCredentials(result);
        }
        setLoadingTarget(false);
    };

    // Handler for generating passwords by length
    const handleGenerateByLength = async () => {
        const length = parseInt(passwordLength);
        if (isNaN(length) || length < 6 || length > 30) { // Enforce reasonable length limits
            setErrorMessage("Please enter a valid password length between 6 and 30 characters.");
            return;
        }
        if (numPasswordsToGenerate < 1 || numPasswordsToGenerate > 200) { // Limit number of passwords
            setErrorMessage("Please enter a number of passwords to generate between 1 and 200.");
            return;
        }

        setLoadingLength(true);
        setGeneratedLengthPasswords(''); // Clear previous results

        let charTypeDescription = '';
        if (characterType === 'mixed') {
            charTypeDescription = 'a mix of uppercase letters, lowercase letters, numbers, and common special characters (!@#$%^&*).';
        } else if (characterType === 'characters') {
            charTypeDescription = 'only uppercase and lowercase letters.';
        } else if (characterType === 'numbers') {
            charTypeDescription = 'only numbers.';
        }

        const prompt = `Generate a list of ${numPasswordsToGenerate} unique, plausible passwords, each exactly ${length} characters long.
Each password should be ${charTypeDescription}
Avoid easily guessable patterns like sequential numbers or dictionary words.
Provide the list as a newline-separated list.`;

        const result = await callGeminiAPI(prompt);
        if (result) {
            setGeneratedLengthPasswords(result);
        }
        setLoadingLength(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 font-inter">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                    <span role="img" aria-label="shield" className="mr-2">🔑</span> Passwords Generator
                </h1>
                <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
                    A tool for ethical hackers, pentesters, and researching students to generate potential username and password lists.
                </p>

                {/* Author Information */}
                <p className="text-center text-gray-500 text-xs mb-8">
                    Made by <a href="https://www.linkedin.com/in/madanraj0" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Madan Raj</a>
                </p>

                {/* Ethical Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-8" role="alert">
                    <p className="font-bold">Important Ethical & Legal Notice:</p>
                    <p className="text-sm">
                        This tool is for **educational and ethical cybersecurity research purposes only**.
                        **DO NOT use this tool for any unauthorized access or illegal activities.**
                        Always ensure you have **explicit permission** from the owner of any device you intend to test.
                        The AI's knowledge is based on its training data and does not perform live internet searches or access real-time breach databases.
                        Misuse of this tool can lead to severe legal consequences.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center border-b border-gray-200 mb-8">
                    <button
                        className={`py-3 px-6 text-lg font-medium rounded-t-lg ${activeTab === 'samples' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('samples')}
                    >
                        Generate from Samples
                    </button>
                    <button
                        className={`py-3 px-6 text-lg font-medium rounded-t-lg ${activeTab === 'target' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('target')}
                    >
                        Generate from Target Info
                    </button>
                    <button
                        className={`py-3 px-6 text-lg font-medium rounded-t-lg ${activeTab === 'length' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('length')}
                    >
                        Generate by Length
                    </button>
                </div>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-6" role="alert">
                        <p className="font-bold">Error:</p>
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'samples' && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="sample-passwords" className="block text-gray-700 text-sm font-bold mb-2">
                                Enter Sample Passwords (one per line):
                            </label>
                            <textarea
                                id="sample-passwords"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-y"
                                placeholder="e.g.,
password123
MyDevice@2024
adminpass
secureIoT"
                                value={samplePasswords}
                                onChange={(e) => setSamplePasswords(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleGenerateSamples}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
                            disabled={loadingSamples}
                        >
                            {loadingSamples ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                'Generate Password List'
                            )}
                        </button>

                        {generatedSamplePasswords && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Passwords:</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedSamplePasswords}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'target' && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="device-manufacturer" className="block text-gray-700 text-sm font-bold mb-2">
                                Device Manufacturer:
                            </label>
                            <input
                                type="text"
                                id="device-manufacturer"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., TP-Link, D-Link, Cisco, Hikvision"
                                value={deviceManufacturer}
                                onChange={(e) => setDeviceManufacturer(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="device-model" className="block text-gray-700 text-sm font-bold mb-2">
                                Device Model (Optional):
                            </label>
                            <input
                                type="text"
                                id="device-model"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Archer C7, SmartCam SNH-V6410PN"
                                value={deviceModel}
                                onChange={(e) => setDeviceModel(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="common-usernames" className="block text-gray-700 text-sm font-bold mb-2">
                                Additional Common Usernames to Consider (comma-separated, optional):
                            </label>
                            <input
                                type="text"
                                id="common-usernames"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., admin, user, root, guest, support, test"
                                value={commonUsernames}
                                onChange={(e) => setCommonUsernames(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleGenerateTargetInfo}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
                            disabled={loadingTarget}
                        >
                            {loadingTarget ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Searching & Generating...
                                </span>
                            ) : (
                                'Generate Credentials from Target Info'
                            )}
                        </button>

                        {generatedTargetCredentials && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Credentials:</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedTargetCredentials}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'length' && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="password-length" className="block text-gray-700 text-sm font-bold mb-2">
                                Desired Password Length (6-30 characters):
                            </label>
                            <input
                                type="number"
                                id="password-length"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., 12"
                                value={passwordLength}
                                onChange={(e) => setPasswordLength(e.target.value)}
                                min="6"
                                max="30"
                            />
                        </div>
                        <div>
                            <label htmlFor="num-passwords" className="block text-gray-700 text-sm font-bold mb-2">
                                Number of Passwords to Generate (1-200):
                            </label>
                            <input
                                type="number"
                                id="num-passwords"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., 50"
                                value={numPasswordsToGenerate}
                                onChange={(e) => setNumPasswordsToGenerate(parseInt(e.target.value) || 0)}
                                min="1"
                                max="200"
                            />
                        </div>
                        <div>
                            <label htmlFor="character-type" className="block text-gray-700 text-sm font-bold mb-2">
                                Character Type:
                            </label>
                            <select
                                id="character-type"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={characterType}
                                onChange={(e) => setCharacterType(e.target.value)}
                            >
                                <option value="mixed">Mixed (Characters & Numbers)</option>
                                <option value="characters">Only Characters (A-Z, a-z)</option>
                                <option value="numbers">Only Numbers (0-9)</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerateByLength}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
                            disabled={loadingLength}
                        >
                            {loadingLength ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                'Generate Passwords by Length'
                            )}
                        </button>

                        {generatedLengthPasswords && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Passwords:</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedLengthPasswords}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
