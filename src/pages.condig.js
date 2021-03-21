import { Face, Live, Record } from './pages'

const pages = [
	{
		path: '/face',
		name: '刷脸签到',
		component: Face,
	},
	{
		path: '/live',
		name: '签到直播',
		component: Live,
	},
	{
		path: '/record',
		name: '签到记录',
		component: Record,
	},
]

export default pages
