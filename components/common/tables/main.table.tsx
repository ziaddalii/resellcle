// noinspection TypeScriptValidateTypes

import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {ReactNode} from "react";

interface Props {
    headers: string[];
    rows: ReactNode;
}

export function MainTable({headers, rows}: Props) {
    return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((e, i) => (<TableCell className="!font-bold" key={i}>{e}</TableCell>))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
    );
}
