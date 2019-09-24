import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const TabItem = ({ link, location, icon, children: text }) => (
  <Link
    to={link}
    className={classNames('tab-item', {'active': link === location.pathname})}
  >
    <i className="material-icons">{icon}</i>
    <label>{text}</label>
  </Link>
)

const Tabs = ({ location }) => (
  <menu className="tabs">
    <TabItem link="/" location={location} icon="schedule">
      Agora
    </TabItem>
    <TabItem link="/schedule" location={location} icon="date_range">
      Programação
    </TabItem>
    <TabItem link="/my-schedule" location={location} icon="bookmark">
      Marcados
    </TabItem>
  </menu>
)

export default Tabs;