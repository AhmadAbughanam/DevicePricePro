import logging

def setup_logger(app):
    logging.basicConfig(
        level=logging.INFO if app.config.get("DEBUG") else logging.WARNING,
        format="%(asctime)s [%(levelname)s] %(message)s"
    )
