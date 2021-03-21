import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Alert, Card, message, Spin, Button, Typography } from 'antd'
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	SyncOutlined,
	HistoryOutlined,
	CloudSyncOutlined,
	SmileOutlined,
	LikeOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import classnames from 'classnames/bind'
import * as faceapi from 'face-api.js'

import { fetchFaceInfo } from './service'
import { getUserVideoMedia } from './utils'
import s from './index.module.scss'

const { Text, Title } = Typography
const cx = classnames.bind(s)

const Face = () => {
	const [mediaStream, setMediaStream] = useState()
	const [modelReady, setModelReady] = useState(false)
	// processing | success | waitRestart | fetchInfo
	const [detectStage, setDetectStage] = useState('loadingModels')
	const [faceInfo, setFaceInfo] = useState({})
	const videoEl = useRef()
	const canvasEl = useRef()
	const imgRef = useRef()
	const displaySize = useRef()
	const getFaceRef = useRef()

	/* 匹配人脸信息 */
	const startFetchMatch = useCallback(async () => {
		setDetectStage('fetchMatch')

		const faceInfo = await fetchFaceInfo()
		setFaceInfo(faceInfo)

		setDetectStage('success')
	}, [])

	/* 实时获取人脸 */
	const getFace = useCallback(async () => {
		const input = videoEl.current
		const canvas = canvasEl.current
		const imgCanvas = imgRef.current
		const displaySizeLocal = displaySize.current

		if (!input || input?.paused || input?.ended) return false

		const detection = await faceapi.detectSingleFace(
			input,
			new faceapi.TinyFaceDetectorOptions({
				scoreThreshold: 0.6,
			})
		)

		if (detection) {
			faceapi.matchDimensions(canvas, displaySizeLocal)
			const resizedDetections = faceapi.resizeResults(
				[detection],
				displaySizeLocal
			)

			faceapi.draw.drawDetections(canvas, resizedDetections)

			input.pause()
			imgCanvas.getContext('2d').drawImage(input, 0, 0, 300, 150)

			startFetchMatch()
			return false
		}

		getFaceRef.current = setTimeout(() => {
			clearTimeout(getFaceRef.current)
			getFace()
		})
	}, [startFetchMatch])

	/* 开始捕捉人脸 */
	const startVideoPlay = useCallback(
		(delay) => {
			videoEl.current.play()
			getFaceRef.current = setTimeout(() => {
				getFace()
				setDetectStage('processing')
				clearTimeout(getFaceRef.current)
			}, delay)
		},
		[getFace]
	)

	const clearCanvas = useCallback(() => {
		const { width, height } = displaySize.current

		canvasEl.current.getContext('2d').clearRect(0, 0, width, height)
		imgRef.current.getContext('2d').clearRect(0, 0, 300, 150)
	}, [])

	/* 确认签到 */
	const handleCheckIn = useCallback(() => {
		clearCanvas()
		setDetectStage('waitRestart')
		startVideoPlay(3000)
	}, [startVideoPlay, clearCanvas])

	/* 重新识别 */
	const restartGetFace = useCallback(() => {
		clearCanvas()
		setDetectStage('waitRestart')
		startVideoPlay(3000)
	}, [startVideoPlay, clearCanvas])

	useEffect(() => {
		const init = async () => {
			await faceapi.loadTinyFaceDetectorModel('/models').catch(() => {
				message.error('模型加载失败，请刷新重试')
			})
			const mediaStream = await getUserVideoMedia()
			window.__mediaStream__ = mediaStream

			setModelReady(true)
			setDetectStage('processing')
			setMediaStream(mediaStream)
		}

		init()

		return () => {
			if (window.__mediaStream__) {
				window.__mediaStream__.getTracks().forEach((track) => {
					if (track.readyState === 'live') {
						track.stop()
					}
				})
			}
		}
	}, [])

	useEffect(() => {
		if (mediaStream) {
			const { width, height } = videoEl.current.getBoundingClientRect()

			displaySize.current = {
				width,
				height,
			}
			videoEl.current.srcObject = mediaStream
			startVideoPlay(300)
		}
	}, [mediaStream, getFace, startVideoPlay])

	const detectStageAlert = useMemo(() => {
		const stageAlertMap = {
			loadingModels: {
				message: '模型加载中 ...',
				icon: <UploadOutlined />,
			},
			processing: {
				message: '人脸检测中 ...',
				icon: <SyncOutlined spin={true} />,
			},
			waitRestart: {
				message: '将在三秒后重新开始检测 ...',
				icon: <HistoryOutlined />,
			},
			fetchMatch: {
				message: '人脸比对中 ...',
				icon: <CloudSyncOutlined />,
			},
			success: {
				message: '人脸比对成功，请确认信息',
				icon: <SmileOutlined />,
				type: 'success',
			},
			checking: {
				message: '签到中，请稍后 ...',
				icon: <SyncOutlined spin={true} />,
			},
			checkIn: {
				message: '恭喜签到成功',
				icon: <LikeOutlined />,
				type: 'success',
			},
		}

		const stage = stageAlertMap[detectStage]

		return (
			<Alert
				message={stage.message}
				showIcon={!!stage.icon}
				type={stage?.type || 'info'}
				icon={stage.icon}
			/>
		)
	}, [detectStage])

	return (
		<div className={cx(s.container)}>
			<div className={cx(s.camera)}>
				{modelReady ? (
					<>
						<video ref={videoEl} className={cx(s.video)}></video>
						<canvas ref={canvasEl} className={cx(s.canvas)}></canvas>
					</>
				) : (
					<Spin tip="loading models..." />
				)}
			</div>
			<div className={cx(s.info)}>
				<Card className={cx(s.card)} title="人脸识别结果">
					<div className={cx(s.stage)}>{detectStageAlert}</div>
					{detectStage === 'success' && (
						<div className={cx(s.faceInfo)}>
							<Typography>
								<Title level={5}>姓名</Title>
								<Text>{faceInfo?.name || '---'}</Text>
								<Title level={5}>性别</Title>
								<Text>{faceInfo?.sex || '---'}</Text>
								<Title level={5}>班级</Title>
								<Text>{faceInfo?.class || '---'}</Text>
								<Title level={5}>学号</Title>
								<Text>{faceInfo?.student_id || '---'}</Text>
							</Typography>
						</div>
					)}
					<div className={cx(s.detectResult)}>
						<canvas ref={imgRef} className={cx(s.imgCanvas)} />
						{detectStage === 'success' && (
							<div className={cx(s.ops)}>
								<Button
									shape="round"
									icon={<CloseCircleOutlined />}
									onClick={restartGetFace}
								>
									重新识别
								</Button>
								<Button
									type="primary"
									shape="round"
									icon={<CheckCircleOutlined />}
									onClick={handleCheckIn}
								>
									确认签到
								</Button>
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}

export default Face
