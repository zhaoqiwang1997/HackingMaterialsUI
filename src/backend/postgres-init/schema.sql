-- Table: public.test

-- DROP TABLE IF EXISTS public.test;

CREATE TABLE IF NOT EXISTS public.test
(
    test_col text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT test_pkey PRIMARY KEY (test_col)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.test
    OWNER to db_user;