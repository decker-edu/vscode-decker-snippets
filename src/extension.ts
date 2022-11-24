import * as vscode from 'vscode';

class TrippleDotFoldingRangeProvider implements vscode.FoldingRangeProvider {
	provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
		let startExp : RegExp = /::: .+/g;
		let endExp : RegExp = /:::/g;

		let result : vscode.FoldingRange[] = [];
		let text = document.getText();
		let lines = text.split("\n");
		let beginnings : number[] = [];
		for(let index = 0; index < lines.length; index++) {
			if(startExp.test(lines[index])) {
				beginnings.push(index);
			} else if (endExp.test(lines[index])) {
				let end = index;
				let beginning = beginnings.pop();
				if(beginning) {
					let fold = new vscode.FoldingRange(beginning, end, vscode.FoldingRangeKind.Region);
					result.push(fold);
				} else {
					beginnings.push(index);
				}
			}
		}
		return result;
	}
}

export function activate(context: vscode.ExtensionContext) {
	let provider : TrippleDotFoldingRangeProvider = new TrippleDotFoldingRangeProvider();
	vscode.languages.registerFoldingRangeProvider(["markdown"], provider);

	registerInsert(context, "decker-snippets.bold", "**${1:Bold Text}**");
	registerInsert(context, "decker-snippets.italic", "*${1:Italic Text}*");
	registerInsert(context, "decker-snippets.image", "![${1:alt-text}](${2:path/link to image})");
	registerInsert(context, "decker-snippets.ul", "- ${1:Item}\n- ${2:Item}\n- ${3:Item}");
	registerInsert(context, "decker-snippets.ol", "1. ${1:Item}\n2. ${2:Item}\n3. ${3:Item}");
	registerInsert(context, "decker-snippets.rule", "---");
	registerInsert(context, "decker-snippets.link", "[${1:Text}](${2:Link} \"${3:Hover Text}\")");
	registerInsert(context, "decker-snippets.blockquote", "> ${1:Quote}");
	registerInsert(context, "decker-snippets.inlinelatex", "\$${1:LaTeX}\$");
	registerInsert(context, "decker-snippets.displaylatex", "\$\$${1:LaTeX}\$\$");
	registerInsert(context, "decker-snippets.inlinecode", "`\n${1:Code}\n`");
	registerInsert(context, "decker-snippets.codeblock", "```\n${1:Code}\n```");

	registerChange(context, "decker-snippets.make-bold", "**${TM_SELECTED_TEXT:${1:Text}}**");
	registerChange(context, "decker-snippets.make-italic", "*${TM_SELECTED_TEXT:${1:Text}}*");
	registerChange(context, "decker-snippets.make-image", "![${1:alt-text}](${TM_SELECTED_TEXT:${2:Link}})");
	registerChange(context, "decker-snippets.make-link", "[${1:Text}](${TM_SELECTED_TEXT:${2:Text}} \"${3:Hover Text}\")");
	registerChange(context, "decker-snippets.make-blockquote", "> ${TM_SELECTED_TEXT:${1:Text}}");
	registerChange(context, "decker-snippets.make-inlinelatex", "\$${TM_SELECTED_TEXT:${1:Text}}\$");
	registerChange(context, "decker-snippets.make-inlinecode", "`\n${TM_SELECTED_TEXT:${1:Code}}\n`");
	registerChange(context, "decker-snippets.make-codeblock", "```\n${TM_SELECTED_TEXT:${1:Code}}\n```");
}

function registerInsert(context: vscode.ExtensionContext, command: string, snippet: string) {
	let subscription = vscode.commands.registerTextEditorCommand(command, (editor, edit, args) => {
		if(editor?.selection.isEmpty) {
			const position = editor.selection.active;
			editor.insertSnippet(new vscode.SnippetString(snippet), position);
		} else {
			const position = editor.selection.end;
			editor.insertSnippet(new vscode.SnippetString(snippet), position);
		}
	});
	context.subscriptions.push(subscription);
}

function registerChange(context: vscode.ExtensionContext, command: string, snippet: string) {
	let subscription = vscode.commands.registerTextEditorCommand(command, (editor, edit, args) => {
		if(!editor?.selection.isEmpty) {
			editor.insertSnippet(new vscode.SnippetString(snippet));
		}
	});
	context.subscriptions.push(subscription);
}

export function deactivate() {
	
}
