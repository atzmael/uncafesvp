const ChosableItem = ({ model, options = {} }) => {
    if (model == null) console.warn("ChosableItem didn't receive a model")

    const focusedAnimate = () => {
        console.log("TODO: tweens and stuff")
    }

    const update = (time) => {
        //TODO: floating ?
    }

    return {
        model,
        focusedAnimate,
        update
    }
}
