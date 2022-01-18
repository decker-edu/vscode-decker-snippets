import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	registerInsert(context, "decker-snippets.bold", "**${1:Bold Text}**");
	registerInsert(context, "decker-snippets.italic", "*${1:Italic Text}*");
	registerInsert(context, "decker-snippets.image", "![${1:alt-text}](${2:path/link to image})");
	registerInsert(context, "decker-snippets.ul", "- ${1:Item}\n- ${2:Item}\n- ${3:Item}");
	registerInsert(context, "decker-snippets.ol", "1. ${1:Item}\n2. ${2:Item}\n3. ${3:Item}");
	registerInsert(context, "decker-snippets.rule", "---");
	registerInsert(context, "decker-snippets.link", "[${1:Text}](${2:Link} \"${3:Hover Text}\")");
	registerInsert(context, "decker-snippets.quote", "> ${1:Quote}");
	registerInsert(context, "decker-snippets.inlinelatex", "\$${1:LaTeX}\$");
	registerInsert(context, "decker-snippets.displaylatex", "\$\$${1:LaTeX}\$\$");
	registerInsert(context, "decker-snippets.incrementaldisplaylatex", "[\$\$\n\\begin{eqnarry*}\n${1:First Step} \\\\ \n${2:Second Step} \\\\ \n\\end{eqnarry*}\n\$\$]{ .math-incremental }");
	registerInsert(context, "decker-snippets.code", "```\n${1:Code}\n```");

	registerChange(context, "decker-snippets.make-bold", "**${TM_SELECTED_TEXT:${1:Text}}**");
	registerChange(context, "decker-snippets.make-italic", "*${TM_SELECTED_TEXT:${1:Text}}*");
	registerChange(context, "decker-snippets.make-image", "![${1:alt-text}](${TM_SELECTED_TEXT:${2:Link}})");
	registerChange(context, "decker-snippets.make-link", "[${1:Text}](${TM_SELECTED_TEXT:${2:Text}} \"${3:Hover Text}\")");
	registerChange(context, "decker-snippets.make-quote", "> ${TM_SELECTED_TEXT:${1:Text}}");
	registerChange(context, "decker-snippets.make-inlinelatex", "\$${TM_SELECTED_TEXT:${1:Text}}\$");
	registerChange(context, "decker-snippets.make-code", "```\n${TM_SELECTED_TEXT:${1:Code}}\n```");
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
