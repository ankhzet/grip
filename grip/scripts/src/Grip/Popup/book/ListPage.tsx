
import * as React from 'react';

import { Link, withRouter } from 'react-router'

import { Glyph } from '../../../components/glyph';
import { Button } from '../../../components/button';
import { Panel, PanelHeader, PanelList } from '../../../components/panel';

import { Book } from '../../Domain/Collections/Book/Book';
import { ManagerInterface } from '../../../components/Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from "./delegates/BookUIDelegateInterface";
import { ShowPage } from './show/ShowPage';
import { EditPage } from './edit/EditPage';
import { PackageInterface } from "../../../core/db/data/PackageInterface";

interface BookItemRowProps {
  manager: ManagerInterface<Book>;
  delegate: BookUIDelegateInterface<Book>;
  book: Book;
}

@withRouter
class BookItemRow extends React.Component<BookItemRowProps, {}> {
  evt: number;

  componentDidMount() {
    this.evt = this.props.manager.changed(this.entityChanged.bind(this));
  }

  componentWillMount() {
    this.props.manager.off(this.evt);
  }

  entityChanged(uids: string[]) {
    if (uids.indexOf(this.props.book.uid) >= 0) {
      this.forceUpdate();
    }
  }

  render() {
    let book = this.props.book;

    return (book || null) && (
      <div className="col-sx-12">
        <div className="input-group">
          <div className="input-group-btn">
            <Button class="btn-xs btn-danger" onClick={ () => this.removeBook() }>
              <Glyph name="remove" />
            </Button>
          </div>

          <Link className="col-xs-7 form-control-static" to={ ShowPage.path(book.uid) } style={{ paddingLeft: "5px;" }}>Book "{ book.title }"</Link>
          <span className="col-xs-3 form-control-static">Chapters: { Object.keys(book.toc).length }</span>

          <div className="input-group-btn">
            <Button class="btn-xs" onClick={ () => this.fetchBook() }>
              <Glyph name="play-circle" />
            </Button>
            <Button class="btn-xs dropdown-toggle" data-toggle="dropdown">
              Actions <span className="caret" />
            </Button>
            <ul className="dropdown-menu pull-right">
              <li>
                <Link to={ EditPage.path(book.uid) }>
                  <Glyph name="edit" />
                  <span className="dropdown-link-text">Edit</span>
                </Link>
              </li>
              <li className="divider" />
              <li>
                <Link onClick={ () => this.removeBook() } to={ ' ' }>
                  <Glyph name="remove" />
                  <span className="dropdown-link-text text-danger">Delete</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  fetchBook() {
    return this.props.delegate.fetchBook(this.props.book);
  }

  removeBook () {
    return this.props.delegate
      .removeBook(this.props.book)
      .then((uid) => {
        if (uid) {
          this.props.delegate.listBooks()
        }
      })
    ;
  }

}

export interface ListPageProps {
  delegate: BookUIDelegateInterface<Book>;
  manager: ManagerInterface<Book>;
}

export class ListPage extends React.Component<ListPageProps, { books: PackageInterface<Book> }> {

  componentWillMount() {
    this.pullBooks();
  }

  componentWillReceiveProps() {
    this.pullBooks();
  }

  pullBooks(uids: string[] = []) {
    return this.props.manager
      .get(uids)
      .then((books: PackageInterface<Book>) => {
        this.setState({
          books,
        });
      });
  }

  render() {
    let books = this.state.books || {};
    let uids = Object.keys(books);

    return (
      <Panel>
        <PanelHeader>
          Books
          <div className="pull-right">
            <Button class="btn-xs" onClick={ () => this.addBook() }>
              <Glyph name="plus" />
            </Button>
          </div>
        </PanelHeader>
        <PanelList>
          {uids.length
            ? uids.map((uid) => (
              <li key={ uid } className="list-group-item">
                <BookItemRow
                  manager={ this.props.manager }
                  delegate={ this.props.delegate }
                  book={ books[uid] } />
              </li>
            ))
            : <li className="list-group-item">
              No books yet
            </li>
          }
        </PanelList>
      </Panel>
    );
  }

  private addBook() {
    return this.props.delegate
      .createBook()
      .then((book) => {
        if (book) {
          this.props.delegate.editBook(book);
        }
      })
    ;
  }
}
