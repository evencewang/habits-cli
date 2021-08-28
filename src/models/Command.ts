import { Argument, Option, OptionValues } from "commander";
import { CommanderCommand, HelpTextPosition } from "../types";

export interface HelpCommand {
  enableOrNameAndArgs?: string | boolean | undefined;
  description?: string | undefined;
}

export interface HelpOption {
  flags?: string;
  description: string;
}

export interface HelpText {
  position: HelpTextPosition;
  text: string;
}

/**
 * A regular command.
 */
export abstract class Command {
  /* *************************************
   * Reserved
   ************************************* */
  private static _command: CommanderCommand = new CommanderCommand();
  protected static rawArgs: string[];

  /* *************************************
   * Signature
   ************************************* */
  /** Name  for this command. */
  static commandName: string;
  /** Description of this command to show in help message. */
  static description: string;

  /* *************************************
   * Inputs
   ************************************* */
  /** Options that this command accepts. */
  static acceptOpts: Option[] = [];
  /** Arguments that this command accepts. */
  static acceptArgs: Argument[] = [];

  /* *************************************
   * Other configurations
   ************************************* */
  /** Allow more arguments than specified in the `acceptArgs` property. */
  static allowExcessArguments: boolean = false;
  /** Override help command's name or description or both. */
  static helpCommand: HelpCommand | undefined = undefined;
  /** Flags and a description to override the help flags and help description
   * Pass in false to disable the built-in help option. */
  static helpOption: HelpOption | undefined = undefined;
  /** Extra help texts to display for this command. */
  static helpTexts: HelpText[] | undefined = undefined;

  /**
   * Initialize the current command with `rawArgs`.
   * You should not worry about calling this if this command is passed
   * into a command collection (i.e., this is a sub-command).
   * If this command is used on the top level, then rawArgs will be
   * `process.argv.slice(2)`, since the first item in `argv` will be
   * a path to node, and the second item will be the program name.
   */
  static init = (rawArgs: string[]) => {
    // Save param values
    this.rawArgs = rawArgs;

    // Registers definitions of this command to the commander command instance.
    this._command.name(this.name);
    this._command.description(this.description);

    // Options and arguments
    this.acceptOpts.forEach((opt) => {
      this._command.addOption(opt);
    });
    this.acceptArgs.forEach((arg) => {
      this._command.addArgument(arg);
    });

    this._command.allowExcessArguments(this.allowExcessArguments);

    if (this.helpCommand) {
      this._command.addHelpCommand(
        this.helpCommand.enableOrNameAndArgs,
        this.helpCommand.description
      );
    }
    if (this.helpOption) {
      this._command.helpOption(
        this.helpOption.flags,
        this.helpOption.description
      );
    }
    if (this.helpTexts) {
      this.helpTexts.forEach(({ position, text }) => {
        this._command.addHelpText(position, text);
      });
    }

    // When the `from` option is set to "user", commander do not
    // skip the first 1 - 2 items in the `rawArgs` array.
    this._command.parse(this.rawArgs, { from: "user" });
  };

  /* *************************************
   * Class methods
   ************************************* */

  /** Object of valid options passed into this command.
   * Remember to declare `acceptOptions` for this to work. */
  protected static get opts(): OptionValues {
    return this._command.opts();
  }

  /** Get arguments passed into this command. */
  protected static get args(): string[] {
    return this._command.args;
  }

  /** Entry point to this command. */
  public static run(): void | Promise<void> {}
}