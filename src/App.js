import { Layout, Menu } from 'antd'
import {
	BrowserRouter as Router,
	Link,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom'
import classnames from 'classnames'

import pages from './pages.condig'
import s from './app.module.css'

import './App.css'

const { Header, Content, Footer } = Layout
const cx = classnames.bind(s)

function App() {
	return (
		<Router>
			<Layout className="layout">
				<Header>
					<div className="logo" />
					<Menu theme="dark" mode="horizontal">
						{pages.map((page) => (
							<Menu.Item key={page.path}>
								<Link to={page.path}>{page.name}</Link>
							</Menu.Item>
						))}
					</Menu>
				</Header>
				<Content style={{ padding: '30px 50px 0 50px' }}>
					<div className={cx([s.content, 'site-layout-content'])}>
						<Switch>
							{pages.map((page) => (
								<Route path={page.path} key={page.name}>
									<page.component />
								</Route>
							))}
							<Route path="*" render={() => <Redirect to="/face" />} />
						</Switch>
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					Face ++ ©2021 Created by Lab 512
				</Footer>
			</Layout>
		</Router>
	)
}

export default App
