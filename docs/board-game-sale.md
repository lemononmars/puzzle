# Board game sale

The shareable page is `/board-games`. It is not linked from the homepage, navigation, portfolio, or shop. Its robots meta tag requests no indexing. Buyers select games, review a message, and contact Sakulbuth through Messenger (`https://m.me/sakulbuth`) or LINE (`lemononmars`). Selecting games does not reserve stock or send a message.

## Edit in Google Sheets

Use the **Board Game Sale List** tab in [the source Sheet](https://docs.google.com/spreadsheets/d/1AtlRUY82vZMHqow1Sz6Zb1ZCn7OOkqUuLUAU1aVAvZw/edit?gid=73895035#gid=73895035).

- Update **sale ฿** (column E) for the selling price. Blank means “ask for price”; an explicit `0` means free. Purchase prices and the 60% calculation are never displayed.
- Add **Availability** as the header in J1, then enter `available`, `reserved`, `sold`, or `hidden` in each game’s row. Thai equivalents `พร้อมขาย`, `ติดจอง`, `ขายแล้ว`, and `ซ่อน` also work. A blank status means “confirm availability”; it does not promise stock.
- Keep **Title**, **Condition**, **Expansion / Add-on**, and **Comment** headers. Edit them normally or add new game rows. A `BGG Link` label without a URL is not displayed as a broken link.
- Keep the Sheet viewable to anyone with its link so the site can read this tab without Google account credentials.

The server reads the tab and caches it for up to 60 seconds. Reload the sale page or use its refresh button after that interval. No website deployment is needed for Sheet edits. Open customer pages do not update until refreshed. Reserved and sold games cannot be selected; hidden rows are excluded.

If Google is unavailable, the page labels its data as a saved copy and asks buyers to confirm price and status. Known “available” statuses become “confirm availability.” The bundled initial copy contains only public sale fields, not purchase costs. To permanently remove a listing, remove it from the Sheet and the bundled snapshot (`src/lib/data/boardGameSaleSnapshot.json`), so a later offline fallback does not restore it.

## Escape room passport

`/portfolio/escape-rooms` uses the **Escape Room** tab’s 49 visits and 7 separate mini games. These are rooms played, not authored rooms. Source dates are converted from spreadsheet serial dates; an absent date remains absent. Blank `Esc?` cells do not imply a successful escape. Personal comments are shown as visit notes. This portfolio page uses a local import in `src/lib/data/escapeRooms.json`; further passport updates require re-importing that file.
