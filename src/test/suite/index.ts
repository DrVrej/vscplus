import * as vscode from "vscode";

export async function run(): Promise<void> {
	console.log("VSC+ Test: start...");
	const extension = vscode.extensions.getExtension("Vrej.vscplus");

	if (!extension) {
		throw new Error("VSC+ Test: extension was not found in the extension host.");
	}

	await extension.activate();

	if (!extension.isActive) {
		throw new Error("VSC+ Test: extension did not activate.");
	}

	const commands = new Set(await vscode.commands.getCommands(true));

	const expectedCommands = [
		"vscplus.reload.workbench",
		"vscplus.display.fileinfo",
		"vscplus.toggle.formatting",
		"vscplus.toggle.wordwrap"
	];

	for (const command of expectedCommands) {
		if (!commands.has(command)) {
			throw new Error(`VSC+ Test: missing command: ${command}`);
		}
	}

	console.log("VSC+ Test: activation and command availability checks passed!");
}