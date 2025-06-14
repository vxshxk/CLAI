#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import boxen from 'boxen';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY 

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
var error = null;

async function performTask(prompt) {
  console.log(`Executing task: ${prompt}`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Give me a command line shell command to do " + prompt + " and return the response in json format with two fields: \"commands\" which is list of commands and \"instructions\" which tells you how to run. The response should only contan the json and nothing else",
    });
    console.log(response.text);
  } catch (e) {
    error = e;
    console.log(e);
  }
}

async function fixError(){
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Give me a steps to fix " + prompt + " and eturn the response in json format with one field: \"error\" which will contain the error.The response should only contan the json and nothing else",
    });
    console.log(response.text);
  } catch (e) {
    error = e;
    console.log(e);
  }
}

const usage = chalk.hex('#8A2BE2')("\nUsage:  clai -t <task>\n"+ "\tclai -f\n"+ boxen(chalk.hex('#8A2BE2')("\n" + "CLAI: Execute commands using Natural language!" + "\n"), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");

const options =  yargs(hideBin(process.argv)).usage(usage)
                     .option("t", {alias:"task", describe: "Task to execute", type: "string", demandOption: false })
                     .option("f", {alias:"fix", describe: "Fix the error", demandOption: false })
                     .help(true).argv;

// Run task if --task or -t is provided
if (options.task) {
  performTask(options.task);
}

// Similarly, run fix function if --fix or -f is provided
if (options.fix) {
  console.log(`Fixing: ${error}`);
  fixError();
}

