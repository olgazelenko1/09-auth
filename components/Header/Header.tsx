import css from './Header.module.css';
import Link from 'next/link';
import TagsMenu from '../TagsMenu/TagsMenu';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

interface HeaderProps {
  tags?: string[];
}

const Header = ({}: HeaderProps) => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <AuthNavigation />
          <TagsMenu />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
