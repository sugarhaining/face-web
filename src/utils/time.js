import moment from 'moment'

export const timeStamp2FormatDate = (timeStamp) => {
	return moment(+timeStamp).format('YYYY-MM-DD HH:MM:SS')
}

export const geneCurrentTimeStamp = () => moment(new Date()).format('x')
