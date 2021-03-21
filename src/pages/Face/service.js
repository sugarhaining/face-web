import { fetchIns } from '../../utils'

export const fetchFaceInfo = async () => {
	const faceInfo = await fetchIns
		.get('/remote-mock')
		.then((res) => res.data.data)

	return faceInfo
}
