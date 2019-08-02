function selectPageItemsByName(items: PageItems, name: string): void {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    if (item.name === name) {
      item.selected = true;
    }
  }
}

function main() {
  const document: Document = app.activeDocument;
  const name: string = 'Top Eyelet';

  document.selection = null;
  selectPageItemsByName(document.pageItems, name);
}

main();
