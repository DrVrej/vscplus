// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

const disposableItems: vscode.StatusBarItem[] = []; // Holds some of the objects, used for disposing

// Objects
let statusBarReload: vscode.StatusBarItem | null = null;
let statusBarTextInfo: vscode.StatusBarItem | null = null;
let statusBarFileSize: vscode.StatusBarItem | null = null;
let statusBarFormatting: vscode.StatusBarItem | null = null;

/** The main function, called when the extension is activated (Usually when VSCode starts) */
export function activate(context: vscode.ExtensionContext) {
	// Disposable items that should be cleaned up
	context.subscriptions.push(vscode.commands.registerCommand("vscplus.reload.workbench", () => {
		vscode.commands.executeCommand("workbench.action.reloadWindow");
	}));
	context.subscriptions.push(vscode.commands.registerCommand("vscplus.toggle.wordwrap", () => {
		vscode.commands.executeCommand("editor.action.toggleWordWrap");
	}));
	context.subscriptions.push(vscode.commands.registerCommand("vscplus.display.fileinfo", () => {
		updateStatusBarFileSize(true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand("vscplus.toggle.formatting", () => {
		updateStatusBarFormatting(true);
	}));

	activateVSCPlus(context);

	// Events & Listeners
	// Settings was changed
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
		// Refresh this extension if one its settings has changed or vscode editor settings changed
		if (event.affectsConfiguration("vscplus") || event.affectsConfiguration("editor")) {
			disposeItems();
			activateVSCPlus(context);
		}
	}));

	// User saves the current active file
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
		//console.log("onDidSaveTextDocument");
		updateStatusBarFileSize();
	}));

	// Current open document changed
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(() => {
		//console.log("onDidChangeTextDocument");
		updateStatusBarTextInfo();
		updateStatusBarFileSize();
	}));

	// Current text editor completely changed
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
		//console.log("onDidChangeActiveTextEditor");
		updateStatusBarTextInfo();
		updateStatusBarFileSize();
	}));

	// User is selecting or moving the editor pointer
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => {
		//console.log("onDidChangeTextEditorSelection");
		updateStatusBarTextInfo();
	}));

	console.log("VSC+ has successfully initialized...");
}

/** Called when the extension is deactivated */
export function deactivate() {
	//console.log("VSC+ has been disabled!");
}

/** Dispose all the items and clears the item array */
function disposeItems(): void {
	disposableItems.splice(0, disposableItems.length).forEach(item => {
		item.dispose();
	});
}

/** Sets an individual item to be disposable */
function disposeSetItem(context: vscode.ExtensionContext, item: vscode.StatusBarItem): void {
	context.subscriptions.push(item);
	disposableItems.push(item);
}

/** Updates the status bar text information */
function updateStatusBarTextInfo(): void {
	// If we have statusBarTextInfo & an active editor, then update statusBarTextInfo's values
	//console.log("------------");
	if (statusBarTextInfo !== null) {
		let editor = vscode.window.activeTextEditor; // The current active editor
		if (editor) {
			let editorDoc = editor.document; // The current open document in the editor
			let finalText = "Lns: " + editorDoc.lineCount + ", Chs: " + editorDoc.getText().length; // The text that will be set to the status bar
			if (vscode.workspace.getConfiguration("vscplus").get("statusBar.textInfo.displaySelection") === true) {
				let selectionLines = 0; // Number of lines selected
				let selectionChars = 0; // Number of characters selected
				editor.selections.forEach(selection => {
					selectionLines += selection.end.line - selection.start.line + 1;
					selectionChars += editorDoc.getText(selection.with()).length;
				});
				// If something has been selected then display the selection info as well
				if (selectionLines > 0 && selectionChars > 0) {
					finalText += " (Sel: " + selectionLines + " Lns, " + selectionChars + " Chs)";
				}
			}
			statusBarTextInfo.text = finalText;
			statusBarTextInfo.show();
		} else {
			statusBarTextInfo.hide();
		}
	}
}

/** 
 * Updates the status bar file size display
 * @param output If true, it will output extra information
 */
async function updateStatusBarFileSize(output: boolean = false) {
	if (statusBarFileSize) {
		let doc = vscode.window.activeTextEditor?.document; // Current active document
		if (doc) {
			let docURI = doc.uri; // The universal resource identifier
			if (docURI.scheme !== "untitled") { // Exclude untitled files
				let byte = (await vscode.workspace.fs.stat(docURI)).size;
				let result: string;
				if (byte >= 1073741824) {
					result = (byte / 1000000000).toFixed(2) + " GB";
				} else if (byte >= 1048576) {
					result = (byte / 1000000).toFixed(2) + " MB";
				} else if (byte >= 1024) {
					result = (byte / 1000).toFixed(2) + " KB";
				} else {
					result = byte + " B";
				}
				//console.log(result);
				statusBarFileSize.text = result;
				statusBarFileSize.show();
				// If we should display the pop up box
				if (output) {
					let outputResult = doc.fileName + " =      " + byte + " Bytes | " + (byte / 1000).toFixed(2) + " Kilobytes | " + (byte / 1000000).toFixed(2) + " MegaBytes | " + (byte / 1000000000).toFixed(2) + " Gigabytes";
					let infoMsg = await vscode.window.showInformationMessage(outputResult, "Copy Path");
					if (infoMsg === "Copy Path") {
						vscode.env.clipboard.writeText(docURI.fsPath);
					}
				}
				return;
			}
		}
		statusBarFileSize.hide();
	}
}

/**
 * Updates the status bar formatting toggle button
 * @param toggle If true, it will toggle the formatting
 */
async function updateStatusBarFormatting(toggle: boolean = false) {
	if (statusBarFormatting) {
		let configTriggers = vscode.workspace.getConfiguration("vscplus").get<string>("statusBar.formatButton.triggers");
		let triggers = {
			onPaste: configTriggers?.includes("onPaste") ?? false,
			onSave: configTriggers?.includes("onSave") ?? false,
			onType: configTriggers?.includes("onType") ?? false
		};
		//console.log("Triggers:", triggers);
		let configEditor = vscode.workspace.getConfiguration("editor"); // Default VSCode formatting options
		let active = (triggers.onPaste && configEditor.get("formatOnPaste")) || (triggers.onSave && configEditor.get("formatOnSave")) || (triggers.onType && configEditor.get("formatOnType")) || false; // Are any of the formatting options active?
		//console.log("Active:", active);

		// If this was a button press...
		if (toggle) {
			active = !active;
			if (triggers.onPaste) { configEditor.update("formatOnPaste", active, vscode.ConfigurationTarget.Global); }
			if (triggers.onSave) { configEditor.update("formatOnSave", active, vscode.ConfigurationTarget.Global); }
			if (triggers.onType) { configEditor.update("formatOnType", active, vscode.ConfigurationTarget.Global); }
		}

		// Finally, set the appropriate text depending on its active status
		if (active) {
			statusBarFormatting.text = "Format $(pass-filled)";
		} else {
			statusBarFormatting.text = "Format $(error)";
		}
	}
}

/** The main function */
function activateVSCPlus(context: vscode.ExtensionContext): void {
	let config = vscode.workspace.getConfiguration("vscplus");

	// Status bar - Reload button
	if (config.get("statusBar.reloadButton.enabled") === true) {
		statusBarReload = vscode.window.createStatusBarItem(config.get("statusBar.reloadButton.alignment") === "right" ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left, -10);
		//statusBarReload.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
		//statusBarReload.color = new vscode.ThemeColor("statusBarItem.errorForeground");
		statusBarReload.command = "vscplus.reload.workbench";
		statusBarReload.text = "$(refresh)";
		statusBarReload.tooltip = "Reload current workbench";
		statusBarReload.show();
		disposeSetItem(context, statusBarReload);
	}

	// Status bar - Editor & Selection Information
	if (config.get("statusBar.textInfo.enabled") === true) {
		statusBarTextInfo = vscode.window.createStatusBarItem(config.get("statusBar.textInfo.alignment") === "right" ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left, 150);
		statusBarTextInfo.tooltip = "Current file's text information";
		updateStatusBarTextInfo();
		disposeSetItem(context, statusBarTextInfo);
	}

	// Status bar - File Size
	if (config.get("statusBar.fileSize.enabled") === true) {
		statusBarFileSize = vscode.window.createStatusBarItem(config.get("statusBar.fileSize.alignment") === "right" ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left, 151);
		statusBarFileSize.command = "vscplus.display.fileinfo";
		statusBarFileSize.tooltip = "Current file's size, click for more information!";
		updateStatusBarFileSize();
		disposeSetItem(context, statusBarFileSize);
	}

	// Status bar - Formatting Toggle
	if (config.get("statusBar.formatButton.enabled") === true) {
		statusBarFormatting = vscode.window.createStatusBarItem(config.get("statusBar.formatButton.alignment") === "right" ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left, -9);
		statusBarFormatting.command = "vscplus.toggle.formatting";
		statusBarFormatting.tooltip = "Toggle file formatting";
		updateStatusBarFormatting();
		statusBarFormatting.show();
		disposeSetItem(context, statusBarFormatting);
	}

	//console.log(context.subscriptions);
}