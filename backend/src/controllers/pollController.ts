import { Response, Request } from "express";

import Poll from "../models/poll";
import PollVotes from "../models/votes_polls";
import "../utils/associationsModel";

const vote = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { poll_id, option_id, user_id } = req.body;

    // Validate
    if (!poll_id || !option_id || !user_id) {
      return res.status(400).json({ success: false, msg: "Missing data" });
    }

    const pollData: any = await Poll.findOne({
      attributes: ["multiple_choices"],
      where: { poll_id },
    });

    if (!pollData) {
      return res.status(404).json({
        success: false,
        msg: "No poll found with id " + poll_id,
      });
    }

    if (!pollData.multiple_choices) {
      await PollVotes.destroy({
        where: { poll_id, user_id },
      });

      await PollVotes.create({ poll_id, option_id, user_id });
    } else {
      const alreadyVoted = await PollVotes.findOne({
        where: { poll_id, option_id, user_id },
      });

      if (alreadyVoted) {
        await alreadyVoted.destroy();
      } else {
        await PollVotes.create({ poll_id, option_id, user_id });
      }
    }

    return res.json({ success: true, action: "Voted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error while voting" + error });
  }
};

const hasVoted = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user;

    const votes = await PollVotes.findAll({
      attributes: ["option_id"],
      where: { user_id },
    });

    return res.json({
      success: true,
      data: votes,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal error " + error });
  }
};

export default { vote, hasVoted };
