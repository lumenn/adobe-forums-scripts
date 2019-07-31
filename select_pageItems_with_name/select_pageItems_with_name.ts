function selectPageItemsByName(items: PageItems, name: string): void {
  for (let i = 0; i<items.length; i++) {
    let item = items[i];

    if (item.name === name) {
      item.selected = true;
    }
  }
}

function main() {
  const document: Document = app.activeDocument;
  let name: string = 'Top Eyelet'

  document.selection = null;
  selectPageItemsByName(document.pageItems, name);
}

main();