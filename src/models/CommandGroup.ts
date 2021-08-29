import assert from "assert";
import { Command } from "./Command";
import { Argument } from "commander";

export class CommandGroup extends Command {
  private _subcommands: Command[] = [];

  // This class represents a group of commands (or even group of group of commands)
  // so excess arguments and excess options should be passed to the commands handling
  // them.
  allowExcessArguments: boolean = true;
  allowUnknownOption: boolean = true;

  constructor(public name: string, public description: string) {
    super();
    return this;
  }

  private _validateSubcommands() {
    assert(
      !this._subcommands.includes(this),
      "Cannot pass a command group into `subcommands` of itself."
    );
  }

  /** Update accept args based on `this.subcommands` field. */
  private _updateAcceptArgs() {
    const subcommandNames: string[] = [];
    this._subcommands.forEach((subcommand) => {
      subcommandNames.push(subcommand.name);
      subcommand.aliases.forEach((alias) => {
        subcommandNames.push(alias);
      });
    });
    this.acceptArgs = [
      new Argument("[sub]", `subcommand of ${this.name}`)
        .argRequired()
        .choices(subcommandNames),
    ];
  }

  public get subcommands(): Command[] {
    return this._subcommands;
  }

  public set subcommands(_subcommands: Command[]) {
    this._subcommands = _subcommands;
    this._validateSubcommands();
    this._updateAcceptArgs();
  }

  // Some convenient helpers to enable faster chain configuration
  public withSubcommands(subcommands: Command[]) {
    this.subcommands = subcommands;
    return this;
  }

  public withAliases(aliases: string[]) {
    this.aliases = aliases;
    return this;
  }

  run(): void | Promise<void> {
    console.log(this.args);
    return undefined;
  }
}