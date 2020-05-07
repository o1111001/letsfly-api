class Cookies {
  static auth(res, token, expiration, response) {
    const cookie = res.status(201).cookie('token', token, {
      expires: new Date(Date.now() + expiration),
      secure: false,
      httpOnly: true,
    }).send(response);
    return cookie;
  }
}

module.exports = Cookies;
