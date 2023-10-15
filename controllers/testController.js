exports.testController = (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'route working successfully',
  });
};

exports.postController = (req, res) => {
  const body = req.body;
  res.status(200).send(body);
};
