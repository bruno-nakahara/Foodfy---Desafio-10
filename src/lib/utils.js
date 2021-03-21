module.exports = {
    date(timestemp) {
        const date = new Date(timestemp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)
        const birthDay = `${day}/${month}`
        const format = `${day}-${month}-${year}`
        const hour = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        return { day, month, year, iso: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`, birthDay, format }
    }
}