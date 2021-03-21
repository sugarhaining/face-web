import React from 'react'
import { PageHeader, Tag, Card } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import classnames from 'classnames/bind'

import s from './index.module.scss'

const cx = classnames.bind(s)

const Live = () => {
	return (
		<div className={cx(s.container)}>
			<PageHeader
				title="当前项目: 毕设培训"
				subTitle="持续时间： 12：00 -- 13：00"
				backIcon={false}
				tags={[
					<Tag
						color="processing"
						icon={<ClockCircleOutlined />}
						className={cx(s.pageHeaderFix)}
					>
						进行中
					</Tag>,
				]}
				extra={<div>已签到： 3人</div>}
			/>
			<div className={cx(s.members)}>
				<div className={cx(s.member)}>
					<div className={cx(s.name)}>苏国涛</div>
					<div className={cx(s.detail)}>17020120066</div>
				</div>
				<div className={cx(s.member)}>
					<div className={cx(s.name)}>苏国涛</div>
					<div className={cx(s.detail)}>17020120066</div>
				</div>
				<div className={cx(s.member)}>
					<div className={cx(s.name)}>苏国涛</div>
					<div className={cx(s.detail)}>17020120066</div>
				</div>
			</div>
			<div className={cx(s.shakeContainer)}>
				<div className={cx([s.shakeEL, 'shake-constant', 'shake-slow'])}>
					<Card title="新增 5 人签到">苏国涛张施翌</Card>
				</div>
			</div>
		</div>
	)
}

export default Live
