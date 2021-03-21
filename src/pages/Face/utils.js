import { notification } from 'antd'

const mediaErrorCallback = (error) => {
	const errorMap = {
		NotAllowedError: '摄像头已被禁用，请在当前浏览器设置中开启后重试',
		AbortError: '硬件问题，导致无法访问摄像头',
		NotFoundError: '未检测到可用摄像头',
		NotReadableError:
			'操作系统上某个硬件、浏览器或者网页层面发生错误，导致无法访问摄像头',
		OverConstrainedError: '未检测到可用摄像头',
		SecurityError: '摄像头已被禁用，请在系统设置或者浏览器设置中开启后重试',
		TypeError: '类型错误，未检测到可用摄像头',
	}

	if (errorMap[error.name]) {
		notification['error']({
			message: '摄像头调用失败',
			description: errorMap[error.name],
		})
	}
}

export const getUserVideoMedia = async () => {
	let mediaStream = null
	const mediaOpt = {
		video: true,
	}

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// 最新标准API
		mediaStream = await navigator.mediaDevices
			.getUserMedia(mediaOpt)
			.catch(mediaErrorCallback)
	} else if (navigator.webkitGetUserMedia) {
		// webkit内核浏览器
		mediaStream = await navigator
			.webkitGetUserMedia(mediaOpt)
			.catch(mediaErrorCallback)
	} else if (navigator.mozGetUserMedia) {
		// Firefox浏览器
		mediaStream = await navigator
			.mozGetUserMedia(mediaOpt)
			.catch(mediaErrorCallback)
	} else if (navigator.getUserMedia) {
		// 旧版API
		mediaStream = await navigator
			.getUserMedia(mediaOpt)
			.catch(mediaErrorCallback)
	}

	return mediaStream
}
