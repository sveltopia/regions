#!/usr/bin/env node

import { intro, outro } from "@clack/prompts";
import { Command } from "commander";
import { addCommand } from "./commands/add.js";

const program = new Command();

program
  .name("regions")
  .description("CLI for @sveltopia/regions")
  .version("1.0.0");

program
  .command("add <name>")
  .description("Generate a new region with schema and wrapper component")
  .action(async (name: string) => {
    intro("Sveltopia Regions Generator");

    try {
      await addCommand(name);
      outro("Done!");
    } catch (error) {
      outro("Something went wrong");
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
