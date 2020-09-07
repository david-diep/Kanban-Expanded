kanban-hackathon
=======

A hackathon complete for the [MintBean 3 Day JavaScript Bootcamp Olympics](https://sites.google.com/mintbean.io/javascriptbootcampolympics/home)

Participants
------
[David Diep](https://github.com/david-diep)

[Kevin Lenell](https://github.com/krlenell)

[Tim Ahn](https://github.com/tim-ahn)

Live Demo
======
[david-diep.github.io/kanban-hackathon](https://david-diep.github.io/kanban-hackathon/)

Features
=======
Features Required for completion of the event:

- When the application starts, you have 3 empty columns: "Todo", "In progress", "Done"

- Each column has a "+" button. The user can click this button to create a task card in any column

- Task cards clearly display the title of the contained task

- The user can move tasks between columns using drag-and-drop

- The user can delete a task.

- The user can expand a task card to see its description

- The user can move tasks between columns using the "Move" button in the context menu

- The user can edit column titles

- The user can create columns

- The user can change the order of columns using drag-and-drop

- The user can delete columns (you will have to decide what happens to a column's cards in this case)

Additional Features:

- Highlighting Tasks and Columns on drag

- User can access a context menu on right click

- User can transfer all tasks from one column to another

- User can view notifications

- Persistent content by saving to LocalStorage

Development
======

System Requirements
------

- Node.js 10 or higher

- npm 6 or higher

Technologies Used
------
- React
- react-beautiful-dnd
- react-toastify
- Bootstrap 4
- create-react-app

### Getting Started


1. Clone this repository

```shell
git clone https://github.com/david-diep/kanban-hackathon.git
cd kanban-hackathon
```
2. Install dependencies with NPM

```shell
npm install
```

3. Start the project.  It can be view at [http://localhost:3000/](http://localhost:3000/) in the browser

```shell
npm run start
```
