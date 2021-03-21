import React, { useState, useCallback, useEffect } from 'react'
import { Button, Table, Modal, Form, Input, TimePicker, message } from 'antd'
import classnames from 'classnames/bind'
import moment from 'moment'
import keys from 'lodash/keys'

import { formItemLayout, columns } from './constants'
import { fetchCreateProject, fetchProjects } from './service'
import s from './index.module.scss'

const cx = classnames.bind(s)
const { Item } = Form
const { RangePicker } = TimePicker
const { TextArea } = Input

const Record = () => {
	const [visible, setVisible] = useState(false)
	const [tableLoading, setTableLoading] = useState(false)
	const [modalConfirmLoading, setModalConfirmLoading] = useState(false)
	const [projects, setProjects] = useState([])
	const [form] = Form.useForm()

	const handleFormValidate = useCallback(async (form) => {
		let err = null
		await form.validateFields().catch((e) => (err = e))

		return err ? false : true
	}, [])

	const handleFormValuesNormalize = useCallback((form) => {
		const values = form.getFieldsValue()
		const normalized = {}
		keys(values).forEach((key) => {
			if (key === 'checkTimeRange' || key === 'stayTimeRange') {
				normalized[key] = values[key].map((v) => moment(v).format('x'))
			} else {
				normalized[key] = values[key]
			}
		})

		return normalized
	}, [])

	const handleModalOk = useCallback(async () => {
		setModalConfirmLoading(true)
		const validateRes = await handleFormValidate(form)
		if (!validateRes) {
			setModalConfirmLoading(false)
			return false
		}

		const normalizedFormData = handleFormValuesNormalize(form)

		await fetchCreateProject(normalizedFormData)

		message.success('创建成功')

		form.resetFields()
		setModalConfirmLoading(false)
		setVisible(false)
	}, [handleFormValidate, form, handleFormValuesNormalize])

	const handleModalClose = () => {
		form.resetFields()
		setVisible(false)
	}

	useEffect(() => {
		const fetch = async () => {
			setTableLoading(true)
			const res = await fetchProjects()
			setProjects(res.project_list)
			setTableLoading(false)
		}

		if (!visible) {
			fetch()
		}
	}, [visible])

	return (
		<div className={cx(s.container)}>
			<Button
				type="primary"
				onClick={() => setVisible(true)}
				style={{ marginBottom: '24px' }}
			>
				新建签到
			</Button>
			<Table
				columns={columns}
				dataSource={projects}
				rowKey="id"
				pagination={false}
				loading={tableLoading}
			/>
			<Modal
				title="新建签到项目"
				okText="创建"
				cancelText="取消"
				confirmLoading={modalConfirmLoading}
				visible={visible}
				onOk={handleModalOk}
				onCancel={handleModalClose}
			>
				<Form {...formItemLayout} form={form}>
					<Item
						name="title"
						required
						label="项目名称"
						rules={[
							{ required: true, message: '项目名称为必填', maxLength: 30 },
						]}
					>
						<Input placeholder="请输入项目名称" />
					</Item>
					<Item
						name="person"
						required
						label="创建人"
						rules={[{ required: true, message: '创建人为必填' }]}
					>
						<Input placeholder="请输入创建人姓名" />
					</Item>
					<Item
						name="checkTimeRange"
						required
						label="签到时间"
						extra="项目允许的可签到时间，例如活动前半个小时"
						rules={[{ required: true, message: '签到时间为必填' }]}
					>
						<RangePicker />
					</Item>
					<Item
						name="stayTimeRange"
						required
						label="进行时间"
						extra="项目的进行时间"
						rules={[{ required: true, message: '进行时间为必填' }]}
					>
						<RangePicker />
					</Item>
					<Item name="remark" label="备注">
						<TextArea showCount maxLength={50} placeholder="输入备注 ..." />
					</Item>
				</Form>
			</Modal>
		</div>
	)
}

export default Record
