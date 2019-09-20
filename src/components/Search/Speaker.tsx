import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ISpeaker } from "app/components/Search";
import * as React from "react";
import Collapse from "@material-ui/core/Collapse";

interface IProps {
    speaker: ISpeaker;
}

const Speaker: React.FC<IProps> = ({ speaker }) => {
    const [expanded, setExpanded] = React.useState(false);
    function handleExpandClick() {
        setExpanded(!expanded);
    }
    const phone = speaker.phone ? speaker.phone : speaker.phone2;
    return (
        <Card>
            <CardHeader
                title={
                    <Typography>
                        {speaker.givenname} {speaker.familyname}
                        <span>{speaker.degree === "e" ? "Ä" : speaker.degree === "m" ? "D" : "?"}</span>
                    </Typography>
                }
                subheader={<Typography>{speaker.congregation_name}</Typography>}
                action={
                    <IconButton onClick={handleExpandClick}>
                        <ExpandMoreIcon />
                    </IconButton>
                }
            />
            <CardContent>
                {phone && (
                    <Typography>
                        Tel: <a href={`tel:${phone}`}>{phone}</a>
                    </Typography>
                )}
                {speaker.email && (
                    <Typography>
                        <a href={`mailto:${speaker.email}`}>{speaker.email}</a>
                    </Typography>
                )}
                {speaker.note && <Typography>{speaker.note}</Typography>}
            </CardContent>
            {/*<CardActions></CardActions>*/}
            <Collapse in={expanded}>hier sollten dann vermutlich alle vorträge aufgelistet werden</Collapse>
        </Card>
    );
};
export default Speaker;
