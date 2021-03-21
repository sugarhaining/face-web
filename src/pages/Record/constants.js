import { Tag, Button } from 'antd'
import { timeStamp2FormatDate, geneCurrentTimeStamp } from '../../utils'

export const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 20 },
	},
}
export const columns = [
	{
		title: '名称',
		dataIndex: 'name',
		key: 'name',
		align: 'center',
	},
	{
		title: '签到时间',
		dataIndex: 'age',
		align: 'center',
		render: (item, value) => {
			return `${timeStamp2FormatDate(
				value.check_start_time
			)} - ${timeStamp2FormatDate(value.check_end_time)}`
		},
	},
	{
		title: '持续时间',
		dataIndex: 'address',
		align: 'center',
		render: (item, value) => {
			return `${timeStamp2FormatDate(
				value.project_start_time
			)} - ${timeStamp2FormatDate(value.project_end_time)}`
		},
	},
	{
		title: '状态',
		key: 'tags',
		align: 'center',
		render: (item, value) => {
			const statusInfo = () => {
				const currentTimeStamp = geneCurrentTimeStamp()

				if (currentTimeStamp < value.check_start_time) {
					return {
						color: 'processing',
						info: '未开始',
					}
				}

				if (currentTimeStamp > value.check_end_time) {
					return {
						color: 'error',
						info: '已结束',
					}
				}

				return {
					color: 'success',
					info: '进行中',
				}
			}

			const status = statusInfo()

			return <Tag color={status.color}>{status.info}</Tag>
		},
	},
	{
		title: '操作',
		key: 'action',
		align: 'center',
		render: (item, value) => {
			return (
				<Button
					type="link"
					disabled={geneCurrentTimeStamp() <= value.check_end_time}
				>
					导出考勤数据
				</Button>
			)
		},
	},
]
