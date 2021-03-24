function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    next()
}

function onlyAdmins(req, res, next) {
    if (!req.session.admin) 
        return res.redirect('/admin/profile')
    
    next()
}

function chefsForAdmin(req, res, next) {
    if (!req.session.admin) 
        return res.redirect('/admin/chefs/users/show')
    
    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId)
        return res.redirect('/admin/profile')

    next()
}

module.exports = {
    onlyUsers,
    onlyAdmins,
    chefsForAdmin,
    isLoggedRedirectToUsers
}