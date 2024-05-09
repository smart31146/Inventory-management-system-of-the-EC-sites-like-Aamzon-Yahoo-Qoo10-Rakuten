import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { NextPage } from "next";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ja from "date-fns/locale/ja";
import { useContext, useState, useMemo } from "react";
import { styled } from "@material-ui/core";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { httpsCallable } from "firebase/functions";
import { FirebaseContext } from "@/lib/firebase/providers/firebase.provider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BatchTypes } from "@/lib";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { v4 as uuidv4 } from "uuid";
import { set } from "date-fns";

const SwapperDiv = styled("div")({
  display: "flex",
  width: "100%",
  gap: "30px",
});
const SwapperCol = styled("div")({
  width: "50%",
  height: "100vh",
  lineHeight: "100%",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
});
const ButtonBoxStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "calc(100% - 40px)",
  padding: "10px 0",
};

type TransitionProps = Omit<SlideProps, "direction">;
function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}
enum EnumProgressStatus {
  NONE = "",
  STARTING = "STARTING",
  PROGRESSING = "PROGRESSING",
}
const Index: NextPage = () => {
  const { functions } = useContext(FirebaseContext);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<EnumProgressStatus | string>(
    EnumProgressStatus.NONE
  );

  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  const handle = async (dateCount = 1) => {
    try {
      setFetching(true);
      const date = dayjs(selectedDate);
      const promises = [];

      for (let i = 0; i < dateCount; i++) {
        const formattedDate = date.add(i, "day").format("YYYY-MM-DD");
        console.log({ formattedDate });

        const batchPromises = selectedBatchFunc.map(async (batch) => {
          if (!batch.func) return;

          const caller = httpsCallable(functions, batch.func);
          const params = {
            finalizedAt: formattedDate,
            aggregatedAt: formattedDate,
            codes: selectedBatch,
            batchName: batch.batch,
            salesChannel: batch.channel,
            adType: batch.batch.replace(/\//g, "-"),
          };

          return await caller({ params });
        });

        promises.push(...batchPromises);
      }

      await Promise.all(promises);

      setFetching(false);
      setMessage("DONE BATCH");
      showMessage(TransitionUp);
    } catch (error) {
      console.error(error);
      setFetching(false);
    }
  };

  const handleTransaction = async (dateCount = 1) => {
    setStatus(EnumProgressStatus.STARTING);
    setFetching(true);

    const caller = httpsCallable(
      functions,
      "api-output-finalizedSalesOnCall"
    );

    try {
      for (let i = 0; i < dateCount; i++) {          
        const formattedDate = dayjs(selectedDate).add(i, "day").format("YYYY-MM-DD");
        const currentProgress = uuidv4();
      
        const result = await caller({
          params: {
            finalizedAt: formattedDate,
            id: currentProgress,
          },
        });

        if (result) {            
          let done = false;
          while (!done) {
            const rsExec = await getExecProgress(currentProgress);
            
            if (!rsExec) {
              done = true;
            } else {
              const data = rsExec.data as any;
              const status = data.status as string;
      
              if (status === "DONE" || status === "ERROR") {
                done = true;
              } else {
                setStatus(`${EnumProgressStatus.PROGRESSING}: ${formattedDate}`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before checking again
              }
            }
          }
        }
      }
      setMessage('DONE');
      showMessage(TransitionUp);
      setStatus(EnumProgressStatus.NONE);
      setFetching(false);
    } catch (error: any) {
      setMessage((error.message as any) || "ERROR");
      showMessage(TransitionUp);
      setStatus(EnumProgressStatus.NONE);
      setFetching(false);
    }
  };

  const getExecProgress = async (execId: string) => {
    const getProgressCaller = httpsCallable(
      functions,
      "api-progress-getExecProgressOnCall"
    );
    return await getProgressCaller({ execId });
  };

  const selectedBatchFunc = useMemo(() => {
    return BatchTypes.filter((batch) => selectedBatch.includes(batch.code));
  }, [selectedBatch]);

  const handleCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>,
    code: string
  ) => {
    if (event.target.checked) {
      if (!selectedBatch.includes(code))
        setSelectedBatch([...selectedBatch, code]);
    } else {
      setSelectedBatch(selectedBatch.filter((batchCode) => batchCode !== code));
    }
  };

  const handleChangeSelectAll = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log({ checked: event.target.checked });
    if (event.target.checked) {
      setSelectedBatch(BatchTypes.map((batch) => batch.code));
    } else {
      setSelectedBatch([]);
    }
  };

  const showMessage = (Transition: React.ComponentType<TransitionProps>) => {
    setOpen(true);
    setTransition(() => Transition);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const testRunDailyCalc = async () => {
    setFetching(true);
    const params = {
      finalizedAt: dayjs(selectedDate).format("YYYY-MM-DD"),
    };
    const caller = httpsCallable(functions, "api-workflow-dailyBatchOnCall");
    await caller({ params });
    setFetching(false);
    setMessage("DONE CALC");
    showMessage(TransitionUp);
  };

  const test = () => {
    const caller = httpsCallable(functions, "api-output-testSheetId");
    caller({});
  };

  const handleOnClearSummarySheets = async () => {
    setStatus(EnumProgressStatus.STARTING);
    setFetching(true);
    try {
      const currentProgress = uuidv4();
      const caller = httpsCallable(
        functions,
        "api-output-clearSummarySheetsOnCall"
      );
      const result = await caller({
        params: {
          id: currentProgress,
        },
      });

      if (result) {
        setStatus(EnumProgressStatus.PROGRESSING);
        const timer: NodeJS.Timer = setInterval(async () => {
          const rsExec = await getExecProgress(currentProgress);
          if (!rsExec) return clearInterval(timer);
          const data = rsExec.data as any;
          const status = data?.status as string;
          if (status === "DONE" || status === "ERROR") {
            setMessage((data.message as string) || "DONE");
            showMessage(TransitionUp);
            setStatus(EnumProgressStatus.NONE);
            clearInterval(timer);
            setFetching(false);
            return;
          }
          setStatus(status as EnumProgressStatus);
        }, 3000);
      }
    } catch (error: any) {
      setMessage((error.message as any) || "ERROR");
      showMessage(TransitionUp);
      setStatus(EnumProgressStatus.NONE);
      setFetching(false);
    }
  };

  return (
    <SwapperDiv>
      <SwapperCol>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ja}
          dateFormats={{ monthAndYear: "yyyy年 MM月" }}
        >
          <CalendarPicker
            disabled={fetching}
            date={selectedDate}
            onChange={(e) => setSelectedDate(e)}
          />
        </LocalizationProvider>
        {status && (
          <Box
            sx={{
              textAlign: "right",
              width: "calc(100% - 40px)",
              letterSpacing: "1px",
              fontSize: "20px",
              color: status === EnumProgressStatus.STARTING ? "yellow" : "red",
            }}
          >
            {status}...
          </Box>
        )}
        {fetching ? (
          <Box sx={ButtonBoxStyle}>
            <LoadingButton loading={fetching} />
          </Box>
        ) : (
          <>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                disabled={!selectedDate}
                loading={fetching}
                onClick={testRunDailyCalc}
              >
                RUN DAILY BATCH
              </LoadingButton>
            </Box>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                disabled={
                  !selectedDate ||
                  !selectedBatchFunc ||
                  selectedBatchFunc.length == 0
                }
                loading={fetching}
                onClick={() => handle(5)}
              >
                Bulk Batch 5 Days
              </LoadingButton>
            </Box>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                disabled={
                  !selectedDate ||
                  !selectedBatchFunc ||
                  selectedBatchFunc.length == 0
                }
                loading={fetching}
                onClick={() => handle(10)}
              >
                Bulk Batch 10 Days
              </LoadingButton>
            </Box>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                disabled={!selectedDate}
                loading={fetching}
                onClick={() => handleTransaction(5)}
              >
                Bulk Transaction 5 Days
              </LoadingButton>
            </Box>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                disabled={!selectedDate}
                loading={fetching}
                onClick={() => handleTransaction(10)}
              >
                Bulk Transaction 10 Days
              </LoadingButton>
            </Box>
            <Box sx={ButtonBoxStyle}>
              <LoadingButton
                loading={fetching}
                onClick={handleOnClearSummarySheets}
                color="warning"
              >
                Clear Summary Sheets
              </LoadingButton>
            </Box>
          </>
        )}
      </SwapperCol>
      <SwapperCol>
        <Box
          sx={{
            paddingBottom: "20px",
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          }}
        >
          <LoadingButton
            disabled={
              !selectedDate ||
              !selectedBatchFunc ||
              selectedBatchFunc.length == 0
            }
            loading={fetching}
            variant="contained"
            onClick={() => handle()}
          >
            Execute{" "}
            {selectedBatch.length === BatchTypes.length
              ? "ALL"
              : selectedBatch.length}{" "}
            Batches
          </LoadingButton>
        </Box>
        <FormControlLabel
          label="Check All"
          disabled={fetching}
          control={
            <Checkbox
              disabled={fetching}
              checked={
                Array.from(new Set(selectedBatch)).length === BatchTypes.length
              }
              indeterminate={
                Array.from(new Set(selectedBatch)).length > 0 &&
                Array.from(new Set(selectedBatch)).length < BatchTypes.length
              }
              onChange={handleChangeSelectAll}
            />
          }
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 200px)",
            overflowY: "auto",
          }}
        >
          {BatchTypes.map((batch) => (
            <FormControlLabel
              key={batch.code}
              label={batch.label}
              value={batch.code}
              disabled={fetching}
              control={
                <Checkbox
                  disabled={fetching}
                  checked={selectedBatch.includes(batch.code)}
                  onChange={(e) => {
                    handleCheckBox(e, batch.code);
                  }}
                />
              }
            />
          ))}
        </Box>
        <Box
          sx={{
            paddingTop: "20px",
          }}
        >
          <LoadingButton
            disabled={!selectedDate}
            loading={fetching}
            variant="contained"
            onClick={() => handleTransaction()}
          >
            Execute Transaction
          </LoadingButton>
        </Box>
        {/* <Button onClick={test}>TEST</Button> */}
      </SwapperCol>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={transition}
        message={message}
        key={transition ? transition.name : ""}
      />
    </SwapperDiv>
  );
};
export default Index;
