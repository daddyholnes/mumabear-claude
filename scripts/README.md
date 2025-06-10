# 🐻 Podplay Sanctuary - Model Information Collector

This script gathers detailed information about AI models from various providers including Gemini, Vertex AI, Anthropic, and OpenAI. It generates a comprehensive markdown report with model specifications, limits, and features.

## 🚀 Features

- Fetches model information from multiple AI providers
- Generates a well-formatted markdown report
- Includes context windows, output limits, RPM, and features
- Works with multiple service accounts for Google Cloud
- Handles errors gracefully and provides clear output

## 🛠️ Prerequisites

- Python 3.8 or higher
- Required Python packages (install using `pip install -r requirements.txt`)
- Valid API keys for the services you want to query
- Google Cloud service account files (for Vertex AI)

## 🔧 Setup

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root with your API keys:
   ```
   # Gemini
   GEMINI_API_KEY_PRIMARY=your-gemini-key-here
   GEMINI_API_KEY_FALLBACK=your-backup-gemini-key-here
   
   # Anthropic
   ANTHROPIC_API_KEY=your-anthropic-key-here
   
   # OpenAI
   OPENAI_API_KEY=your-openai-key-here
   ```

3. Place your Google Cloud service account JSON files in the project root:
   - `podplay-build-alpha-8fcf03975028.json`
   - `podplay-build-beta-10490f7d079e.json`

## 🚀 Usage

Run the script:

```bash
python model_info_collector.py
```

The script will:
1. Collect model information from all configured providers
2. Generate a detailed markdown report in the `model_reports` directory
3. Print a summary of the collected information

## 📊 Sample Output

The generated report will include:
- Summary table of all models
- Detailed sections for each provider
- Model specifications including context windows and limits
- Links to pricing and documentation

## 📝 Notes

- The script creates a timestamped report each time it runs
- If an API key is not provided, the script will skip that provider
- For Vertex AI, ensure your service account has the necessary permissions

## 🤝 Contributing

Feel free to submit issues or pull requests for any improvements or additional providers.
