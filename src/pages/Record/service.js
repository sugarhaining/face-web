import { fetchIns } from '../../utils'

export const fetchCreateProject = async (data) => {
	const { title, person, checkTimeRange, stayTimeRange, remark } = data

	const res = await fetchIns
		.post('/project', {
			name: title,
			owner: person,
			check_start_time: checkTimeRange[0],
			check_end_time: checkTimeRange[1],
			project_start_time: stayTimeRange[0],
			project_end_time: stayTimeRange[1],
			description: remark,
		})
		.then((res) => res.data.data)

	return res
}

export const fetchProjects = async () => {
	const res = await fetchIns.get('/project').then((res) => res.data.data)

	return res
}
