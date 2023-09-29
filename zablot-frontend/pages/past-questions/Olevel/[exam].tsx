import React from "react";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import FetchUser from "@lib/fetch_user";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { Breadcrumbs, Button, Chip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CardActionArea } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
import { Subjects } from "@utils/questions";
import NavigateNextIcon from "@mui/icons-material/NavigateNextRounded";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
// import getUser from "@lib/getUser";
import WithUser from "@comp/WithUser";
import { verify } from "@lib/token";
import getUser from "@lib/getUser";

export default function PastQuestions(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = useAppSelector((state) => state.sessionStore.user);
  const dispatch = useAppDispatch();
  const [tab, setTab] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const routes = router.route.split("/");

  React.useEffect(() => {});

  return (
    <WithUser user={props.user}>
      <div className="content-main">
        <div className="past-questions-wrapper">
          <div className="nav-bar">
            <div className="nav-back">
              <IconButton size="small" onClick={() => router.back()}>
                <ArrowBack fontSize="small" />
              </IconButton>
            </div>
            <div className="nav-group">
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link href="/past-questions" passHref>
                  <Chip
                    sx={{ fontWeight: 500, color: "inherit" }}
                    label="past-question"
                    size="small"
                  />
                </Link>
                <Chip
                  label="Olevel"
                  size="small"
                  sx={{ fontWeight: 500, color: "inherit" }}
                />
                <Chip
                  label={router.query.exam}
                  size="small"
                  sx={{ fontWeight: 500, color: "inherit" }}
                />
              </Breadcrumbs>
            </div>
          </div>
          <div className="page-title">
            <div className="primary-text">Olevel Past Questions</div>
            <div className="secondary-text">
              Olevel exams. it is 97% guaranteed
            </div>
          </div>
          <div className="exams-wrapper">
            <div className="card-wrappers exam-list">
              {Subjects.map((subject, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      dur: "1s",
                      d: 0.1 * index + "s",
                    }}
                    key={index}
                    onClick={() =>
                      router.push(
                        `/past-questions/Olevel/${subject.name.toLocaleLowerCase()}`
                      )
                    }
                  >
                    <CardActionArea className="exam card">
                      <div className="exam-title">
                        {subject.name.toLocaleUpperCase()}
                      </div>
                      <div className="content">
                        <div className="quesions">
                          {subject.questions}+ Questions
                        </div>
                        <div className="subjects">
                          {subject.theories}+ Theories
                        </div>
                      </div>
                    </CardActionArea>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="education-news-update">
          <div className="latest-news education">
            <div className="header">
              <div className="title">Update on Education news</div>
            </div>
            <div className="news-body">
              {[...(Array(5).keys() as unknown as number[])].map((key) => {
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      dur: "1s",
                      d: 0.1 * key + "s",
                    }}
                  >
                    <CardActionArea className="news-group">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Commodi numquam quasi molestias nihil tempora quas error
                      quia veniam perferendis non inventore illum, eum atque
                      ratione similique sequi? Debitis, neque alias.
                    </CardActionArea>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </WithUser>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext<{ exam: string }>): Promise<
  GetServerSidePropsResult<{ user: Zablot.User; params?: { exam: string } }>
> {
  try {
    const sid = req.cookies.sid as string;

    if (!sid || verify(sid).error) throw new Error("User not found");

    const { user, success } = await getUser(sid);
    if (!user) throw new Error("User not found");

    const exams = ["jamb", "waec", "gce", "neco"];
    if (!exams.includes(params!.exam)) {
      return {
        notFound: true,
      };
    }

    return {
      props: { user, params: params as { exam: string } },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}