from celery import Celery

def make_celery(app):
    # print(app.import_name)
    celery = Celery(
        "main",
        backend=app.config['RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'],
        enable_utc = False,
        timezone = "Asia/Calcutta"
    )
    # print(app.config["RESULT_BACKEND"], app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery