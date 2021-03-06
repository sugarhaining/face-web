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

		message.success('εε»Ίζε')

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
				ζ°ε»Ίη­Ύε°
			</Button>
			<Table
				columns={columns}
				dataSource={projects}
				rowKey="id"
				pagination={false}
				loading={tableLoading}
			/>
			<Modal
				title="ζ°ε»Ίη­Ύε°ι‘Ήη?"
				okText="εε»Ί"
				cancelText="εζΆ"
				confirmLoading={modalConfirmLoading}
				visible={visible}
				onOk={handleModalOk}
				onCancel={handleModalClose}
			>
				<Form {...formItemLayout} form={form}>
					<Item
						name="title"
						required
						label="ι‘Ήη?εη§°"
						rules={[
							{ required: true, message: 'ι‘Ήη?εη§°δΈΊεΏε‘«', maxLength: 30 },
						]}
					>
						<Input placeholder="θ―·θΎε₯ι‘Ήη?εη§°" />
					</Item>
					<Item
						name="person"
						required
						label="εε»ΊδΊΊ"
						rules={[{ required: true, message: 'εε»ΊδΊΊδΈΊεΏε‘«' }]}
					>
						<Input placeholder="θ―·θΎε₯εε»ΊδΊΊε§ε" />
					</Item>
					<Item
						name="checkTimeRange"
						required
						label="η­Ύε°ζΆι΄"
						extra="ι‘Ήη?εθ?Έηε―η­Ύε°ζΆι΄οΌδΎε¦ζ΄»ε¨εεδΈͺε°ζΆ"
						rules={[{ required: true, message: 'η­Ύε°ζΆι΄δΈΊεΏε‘«' }]}
					>
						<RangePicker />
					</Item>
					<Item
						name="stayTimeRange"
						required
						label="θΏθ‘ζΆι΄"
						extra="ι‘Ήη?ηθΏθ‘ζΆι΄"
						rules={[{ required: true, message: 'θΏθ‘ζΆι΄δΈΊεΏε‘«' }]}
					>
						<RangePicker />
					</Item>
					<Item name="remark" label="ε€ζ³¨">
						<TextArea showCount maxLength={50} placeholder="θΎε₯ε€ζ³¨ ..." />
					</Item>
				</Form>
			</Modal>
		</div>
	)
}

export default Record
