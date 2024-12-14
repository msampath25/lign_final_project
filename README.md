# UCSD Course Search
### LIGN 167 Final Project
### Amber Tse, Manish Sampath, and Safa Saeed

UCSD Course Search is an application that utilizes GPT-4o mini to make course recommendations for UCSD students based on their preferences. We pull data from [CAPEs reviews](https://www.kaggle.com/datasets/sanbornpnguyen/ucsdcapes/data) and the course catalogs to inform the OpenAI API's decisions.

**Note:** We utilized both ChatGPT and the professional version of Claude to write our code, particularly the `.vue` files used for our file processing, OpenAI API call, and application interface.

## Installation

To run our program locally using Node.js, you first need to install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm):

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash # Downloads and runs installation script
```
```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Then, install the required version of Node.js and install dependencies:

```sh
nvm install 22
nvm use 22
npm install papaparse
npm install axios
```

Next, clone this repository and then navigate to the `lign_final_project` directory:

```sh
git clone https://github.com/msampath25/lign_final_project
cd lign_final_project
```

You will need to provide your OpenAI API key for the application to work. Do this by creating a `.env` file in the `backend` directory of the repo. The required contents of the file can be seen below, replacing `your_key` with the actual API key. Ensure there is a space before and after the `=` sign for proper use:

```sh
OPENAI_API_KEY = your_key
```

If this alone does not work, you may have to run the above command directly from the command line to export `OPENAI_API_KEY` as an environment variable.

Navigate to the `backend` directory and run `npm install` to install the necessary dependences:

```sh
cd backend
npm install
```

Navigate to the `frontend` directory and run `npm install` to install the necessary dependences:

```sh
cd ../frontend
npm install
```

## Running the Tool

Once everything is installed properly, navigate to the `frontend` directory. Then, run the following command to start the application:

```sh
npm run dev
```
Copy and paste the provided `Local` link, for example `http://localhost:5173/` into your browser.

You should now be able to see the buttons to select Course Level and Department, along with the Generate Search prompt entry area. Make all of your selections, enter your prompt, and press submit to see your class recommendations generate on the right side of the screen.

If you want to submit a new search, make sure to click `Clear Conversation` first so the API call is not overloaded.

## Contact

If you have any questions or problems running the tool, please contact us below:

Amber Tse: atse@ucsd.edu

Manish Sampath: msampath@ucsd.edu

Safa Saeed: sasaeed@ucsd.edu
